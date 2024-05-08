import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginDto } from './dtos';
import { UsersService } from '../users/users.service';
import checkUsername from 'src/utils/checkUserName/check-username.util';
import { CustomException, MessageResponse } from 'src/common';
import { KeytokenService } from '../keytoken';
import { KeyTokenEntity, SessionEntity } from 'src/entities';
import { EntityManager } from 'typeorm';

import { RefreshTokenDto } from './dtos/refreshToken.dto';
import { Response } from 'express';
import { setExpireAt } from 'src/utils';

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

  private async setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
  ): Promise<void> {
    const expires = setExpireAt(3);
    res.cookie('Authentication', refreshToken, {
      secure: true,
      httpOnly: true,
      expires,
    });
  }

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
  public async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<MessageResponse> {
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
      const createSession = new SessionEntity({
        users: foundUser,
        token: createToken.refreshToken,
        expiresAt: setExpireAt(3),
      });
      // save token to database
      await this.entityManager.transaction(async (entityManager) => {
        // save token to database
        await entityManager.save(saveKeyToken);
        // save session to database
        await entityManager.save(createSession);

        // add token to user
        foundUser.keyTokens = [saveKeyToken];
        // add session to user
        // foundUser.sessions = [createSession];

        await entityManager.save(foundUser);
      });
      // set cookie
      this.setRefreshTokenCookie(res, createToken.refreshToken);

      return {
        success: true,
        message: 'Login Success',
        data: createToken.refreshToken,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
  public async refreshToken(
    refreshToken: RefreshTokenDto,
  ): Promise<MessageResponse> {
    try {
      console.log(refreshToken);
      return {
        success: true,
        message: 'Refresh Token Success',
        data: {},
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
