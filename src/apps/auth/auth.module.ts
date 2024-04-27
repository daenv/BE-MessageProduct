import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/entities';

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [AuthService],
})
export class AuthModule {}
