import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dtos';
import { UserEntity } from 'src/entities';
import { UserRepository } from 'src/repositories';
import { MessageResponse } from 'src/common/interfaces';
import { CustomException } from 'src/common';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: UserRepository,
  ) {}

  /* The `foundUserByUserName` method is a private asynchronous function in the `AuthService` class. It
  takes a `username` parameter as input and returns a `Promise` that resolves to a `UserEntity`
  object. */
  private async foundUserByUserName(username: string): Promise<UserEntity> {
    const foundUser = await this._userRepository.findOne({
      where: { username: username },
    });
    return foundUser;
  }
  private async findUserByEmail(email: string): Promise<UserEntity> {
    const foundUser = await this._userRepository.findOne({
      where: {
        email: email,
      },
    });
    return foundUser;
  }
  /**
   *
   *
   */

  private async createUsers(
    user: CreateUserDto,
    header: any,
  ): Promise<MessageResponse> {
    try {
      // salt
      const salt = bcrypt.genSaltSync(10);
      // hash pw
      const HashPw = bcrypt.hashSync(user.password, salt);
      // create user
      const newUser = await this._userRepository.create({
        ...user,
        password: HashPw,
      });
      // Generate RSA key pair asynchronously
      // const  {publicKey, privateKey } = await
      return {
        success: false,
        data: {},
        message: '',
      };
    } catch (error) {
      throw new CustomException(error.message);
    }
  }

  public async login() {}

  public async register(_req: CreateUserDto, header: any): Promise<unknown> {
    // const check username
    const checkUserName = await this.foundUserByUserName(_req.username);
    if (checkUserName) {
      return {
        success: false,
        message: 'Username is exist',
      };
    }
    // const check email
    const checkEmail = await this.findUserByEmail(_req.email);
    if (checkEmail) {
      return {
        success: false,
        message: 'Email is exist',
      };
    }
    return await this.createUsers(_req, header);
  }
}
