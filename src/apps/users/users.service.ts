import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dtos';
import { CustomException, MessageResponse } from 'src/common';
import { UserEntity } from 'src/entities';
import { KeytokenService } from '../keytoken';

@Injectable()
export class UsersService {
  /**
   *
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly _usersRepository: UserRepository,
    private readonly entityManager: EntityManager,
    private readonly _keyTokenService: KeytokenService,
  ) {}

  private async getUsers(): Promise<UserEntity[]> {
    try {
      return;
    } catch (error) {
      throw new CustomException(error);
    }
  }
  private async getUserByUserName(userName: string): Promise<UserEntity> {
    try {
      const foundUser = await this._usersRepository.findOne({
        where: { username: userName },
        //         relations: ['sessions', 'roles', 'keyTokens'],
      });
      return foundUser;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  public async createUser(user: CreateUserDto): Promise<MessageResponse> {
    try {
      // find User
      const foundUser = await this.getUserByUserName(user.username);
      if (foundUser) {
        return {
          success: false,
          message: 'User already exists',
          data: user,
        };
      }
      // hash password
      const salt = bcrypt.genSaltSync(10);
      const hasdPw = bcrypt.hashSync(user.password, salt);
      // create user
      const newUser = new UserEntity({
        username: user.username,
        email: user.email,
        password: hasdPw,
      });
      const savedUser = await this.entityManager.save(newUser);
      return {
        success: true,
        message: 'User created successfully',
        data: {
          user: savedUser,
        },
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
