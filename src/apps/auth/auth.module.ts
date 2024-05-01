import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/entities';
import { KeytokenModule } from '../keytoken/keytoken.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature(entities), KeytokenModule, UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
