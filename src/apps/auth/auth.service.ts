import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dtos';
import { CustomException, MessageResponse } from 'src/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(private readonly _userSerivce: UsersService) {}

  /**
   *
   *
   */

  public async login() {}

  public async register(_req: CreateUserDto, header: any): Promise<unknown> {
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
