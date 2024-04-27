import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities';
import { UserRepository } from 'src/repositories';
import { MessageResponse } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: UserRepository,
  ) {}
  public async login() {}
  public async register(
    _req: CreateUserDto,
    header: any,
  ): Promise<MessageResponse> {
    console.log('header', header);

    return {
      success: true,
      message: 'Account created successfully',
      data: _req,
    };
  }
}
