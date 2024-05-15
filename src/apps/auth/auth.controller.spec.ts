import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { Response } from 'express';
import _ from 'underscore';
import { MessageResponse } from 'src/common';
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });
  describe('login', () => {
    it('should login a user and omit password from response', async () => {
      const loginDto: LoginDto = { username: 'tessuser', password: 'testtttt' };
      const res = { cookie: jest.fn() } as unknown as Response;
      const loginResult: MessageResponse = {
        message: 'Login successful',
        data: {
          username: 'testuser',
          password: 'testtttt',
        },
        success: true,
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

      const result = await authController.login(loginDto, res);
      expect(result).toEqual(_.omit(loginResult, 'password'));
      expect(authService.login).toHaveBeenCalledWith(loginDto, res);
    });
  });
});
