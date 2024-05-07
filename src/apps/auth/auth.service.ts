import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginDto } from './dtos';
import { UsersService } from '../users/users.service';
import checkUsername from 'src/utils/checkUserName/check-username.util';
import { CustomException, MessageResponse } from 'src/common';
import { KeytokenService } from '../keytoken';
import { KeyTokenEntity } from 'src/entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    private readonly _userService: UsersService,
    private readonly _keyTokenService: KeytokenService,
    private readonly entityManager: EntityManager,
  ) {}

  public async register(registerDto: CreateUserDto): Promise<unknown> {
    try {
      // check UserName
      checkUsername(registerDto.username);
      const createUser = await this._userService.createUser(registerDto);
      return createUser;
    } catch (error) {
      throw new CustomException(error);
    }
  }
  public async login(loginDto: LoginDto): Promise<MessageResponse> {
    try {
      const foundUser = await this._userService.getUserByUserName(
        loginDto.username,
      );

      if (!foundUser) {
        return {
          success: false,
          message: 'User not found',
          data: {},
        };
      }
      const isValid = bcrypt.compareSync(loginDto.password, foundUser.password);
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid Password',
          data: {},
        };
      }

      const createToken = await this._keyTokenService.createNewToken(
        foundUser.id,
      );

      const saveKeyToken = new KeyTokenEntity({
        publicKey: createToken.publicKey,
        refreshToken: [createToken.refreshToken],
      });

      foundUser.keyTokens = [saveKeyToken];
      await this.entityManager.save(foundUser);
      // save cookie
      return {
        success: true,
        message: 'Login Success',
        data: createToken.refreshToken,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
