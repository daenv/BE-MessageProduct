import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from 'src/repositories';
import { KeytokenService } from '../keytoken/keytoken.service';
import { CustomException } from 'src/common';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockKeyTokenService = {
  generateRsaKeyPair: jest.fn(),
  createTokenPair: jest.fn(),
  saveKeyToken: jest.fn(),
};

const createUserDto = {
  username: 'testusername',
  email: 'test@email.com',
  password: 'testpassword',
};

const newUser = {
  id: 1,
  username: 'testusername',
  email: 'testUserEmail@gmail.com',
  password: 'testpassword',
};

const generatedKeyPair = {
  publicKey: 'publicKey',
  privateKey: 'privateKey',
};

const createdKeyToken = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};
const saveTokenService = {
  token: 'token',
  publicKey: 'publicKey',
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        { provide: KeytokenService, useValue: mockKeyTokenService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    mockUserRepository.create.mockResolvedValue(createUserDto);
    mockUserRepository.save.mockResolvedValue(newUser);
    mockKeyTokenService.generateRsaKeyPair.mockResolvedValue(generatedKeyPair);
    mockKeyTokenService.createTokenPair.mockResolvedValue(createdKeyToken);
    mockKeyTokenService.saveKeyToken.mockResolvedValue(saveTokenService);

    const response = await service.createUser(createUserDto);

    expect(response.success).toBe(true);
    expect(response.message).toBe('User created successfully');
    expect(response.data.user).toEqual(newUser);
    expect(response.data.keyToken).toEqual(createdKeyToken.accessToken);

    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.any(String),
    });

    expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    expect(mockKeyTokenService.generateRsaKeyPair).toHaveBeenCalled();
    expect(mockKeyTokenService.createTokenPair).toHaveBeenCalledWith(
      { userId: newUser.id },
      generatedKeyPair.publicKey,
      generatedKeyPair.privateKey,
    );
    expect(mockKeyTokenService.saveKeyToken).toHaveBeenCalledWith(
      createdKeyToken.refreshToken,
      generatedKeyPair.publicKey,
    );
  });
  it('should throw an error for invalid password', async () => {
    try {
      await service.createUser({
        username: 'testusername',
        password: 'testpassword',
        email: 'testemail@email.com',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CustomException);
    }
    expect(mockUserRepository.create).not.toHaveBeenCalled();
    expect(mockKeyTokenService.generateRsaKeyPair).not.toHaveBeenCalled();
  });
  it('should throw an error for invalid email', async () => {
    try {
      await service.createUser({
        username: 'testusername',
        password: 'testpassword',
        email: 'testemail@email.com',
      });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockKeyTokenService.generateRsaKeyPair).not.toHaveBeenCalled();
      expect(mockKeyTokenService.createTokenPair).not.toHaveBeenCalled();
      expect(mockKeyTokenService.saveKeyToken).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(CustomException);
    }
  });
});
