import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos';

import { UsersService } from '../users/users.service';
import checkUsername from 'src/utils/checkUserName/check-username.util';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(private readonly _userService: UsersService) {}

  public async register(registerDto: CreateUserDto): Promise<unknown> {
    try {
      // check UserName
      checkUsername(registerDto.username);

      const createUser = await this._userService.createUser(registerDto);
      return createUser;
    } catch (error) {
      throw new BadGatewayException(error.message, error.stack);
    }
  }
}
