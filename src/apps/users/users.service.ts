import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException, MessageResponse } from 'src/common';
import { UserEntity } from 'src/entities';
import { UserRepository } from 'src/repositories';
import { CreateUserDto } from './dtos';

import * as bcrypt from 'bcrypt';
import { KeytokenService } from '../keytoken/keytoken.service';

@Injectable()
export class UsersService {
  /**
   *
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: UserRepository,
    private readonly _keyTokenService: KeytokenService,
  ) {}

  /* The `foundUserByUserName` method is a private asynchronous function in the `AuthService` class. It
  takes a `username` parameter as input and returns a `Promise` that resolves to a `UserEntity`
  object. */
  public async foundUserByUserName(username: string): Promise<UserEntity> {
    const foundUser = await this._userRepository.findOne({
      where: { username: username },
    });
    return foundUser;
  }

  /* The `findUserByEmail` method is a private asynchronous function in the `AuthService` class. It
  takes a `email` parameter as input and returns a `Promise` that resolves to a `UserEntity`
  object. */
  public async findUserByEmail(email: string): Promise<UserEntity> {
    const foundUser = await this._userRepository.findOne({
      where: {
        email: email,
      },
    });
    return foundUser;
  }

  public async createUser(user: CreateUserDto): Promise<MessageResponse> {
    try {
      const salt = bcrypt.genSaltSync(10);

      const hashedPw = await bcrypt.hash(user.password, salt);
      const newUser = await this._userRepository.create({
        ...user,
        password: hashedPw,
      });
      await this._userRepository.save(newUser);
      const { publicKey, privateKey } =
        await this._keyTokenService.generateRsaKeyPair();

      // create KeyToken
      const keyToken = await this._keyTokenService.createTokenPair(
        { userId: newUser.id },
        publicKey,
        privateKey,
      );
      //       console.log('keyToken:::', keyToken);
      // save KeyToken
      await this._keyTokenService.saveKeyToken(
        keyToken.refreshToken,
        publicKey,
      );

      return {
        success: true,
        message: 'User created successfully',
        data: {
          user: newUser,
          keyToken: keyToken.accessToken,
        },
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
