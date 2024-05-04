import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginDto } from './dtos';
import { CustomException, MessageResponse } from 'src/common';
import { UsersService } from '../users/users.service';
import { KeytokenService } from '../keytoken/keytoken.service';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    private readonly _userSerivce: UsersService,
    private readonly _keyTokenService: KeytokenService,
  ) {}

  /**
   *
   *
   */

  public async login(_req: LoginDto): Promise<MessageResponse> {
    try {
      console.log(_req);
      // find username
      const foundUser = await this._userSerivce.foundUserByUserName(
        _req.username,
      );
      // check password
      const checkPassword = await bcrypt.compare(
        _req.password,
        foundUser.password,
      );

      if (!checkPassword) {
        return {
          success: false,
          message: 'Password is incorrect',
        };
      }

      delete _req.password;

      console.log('userr::', foundUser);

      const keyToken = await this._keyTokenService.findTokenByIdUser(
        foundUser.id,
      );

      console.log('keyToken::', keyToken);
      // create token
      // const token = await this._keyTokenService.createToken(foundUser);

      return {
        success: true,
        message: 'Login success',
        data: {
          // token: token,
        },
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }

  public async register(_req: CreateUserDto): Promise<unknown> {
    // const check username
    const checkUserName = await this._userSerivce.foundUserByUserName(
      _req.username,
    );
    if (checkUserName) {
      return {
        success: false,
        message: 'Username is exist',
      };
    }
    // const check email
    const checkEmail = await this._userSerivce.findUserByEmail(_req.email);
    if (checkEmail) {
      return {
        success: false,
        message: 'Email is exist',
      };
    }
    const createUserRegister = await this._userSerivce.createUser(_req);
    return createUserRegister;
  }
}
