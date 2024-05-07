import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories';
import { CreateUserDto } from './dtos';
import { CustomException, MessageResponse } from 'src/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersService {
  /**
   *
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly _usersRepository: UserRepository,
    private readonly entityManager: EntityManager,
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
      // create User

      return {
        success: false,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
