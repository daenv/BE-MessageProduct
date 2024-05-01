import { Module } from '@nestjs/common';
import { KeytokenService } from './keytoken.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [KeytokenService],
  exports: [KeytokenService],
})
export class KeytokenModule {}
