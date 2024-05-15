import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/entities';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
