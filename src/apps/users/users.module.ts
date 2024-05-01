import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/entities';
import { KeytokenModule } from '../keytoken/keytoken.module';

@Module({
  imports: [TypeOrmModule.forFeature(entities), KeytokenModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
