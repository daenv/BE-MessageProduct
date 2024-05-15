import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException, MessageResponse } from 'src/common';
import { RoleEntity } from 'src/entities';
import { RoleRepository } from 'src/repositories';
import { EntityManager } from 'typeorm';
import { CreateRoleDto } from './dtos/create-role.dto';
import { Request } from 'express';

@Injectable()
export class RolesService {
  /**
   *
   */
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: RoleRepository,
    private readonly entityManager: EntityManager,
  ) {}

  public async getRoles(): Promise<RoleEntity[]> {
    try {
      const roles = await this.roleRepository.find();
      return roles;
    } catch (error) {
      throw new Error(error);
    }
  }
  public async getRoleByName(name: string): Promise<MessageResponse> {
    try {
      const role = await this.roleRepository.findOne({
        where: { name: name },
        relations: ['users'],
      });
      return {
        success: true,
        data: { role: role },
        message: 'role ' + name,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
  public async getUsersByRoles(roleName: string): Promise<MessageResponse> {
    try {
      const role = await this.roleRepository.find({
        where: { name: roleName },
        relations: ['users'],
      });
      return {
        success: true,
        data: { users: role.map((r) => r.name) },
        message: 'users with role ' + roleName,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
  public async createRole(
    createRole: CreateRoleDto,
    req: Request,
  ): Promise<MessageResponse> {
    // req token in cookie

    const foundRole = await this.roleRepository.findOne({
      where: { name: createRole.name },
    });
    if (foundRole) {
      return {
        success: false,
        message: 'role' + createRole.name + 'already exist',
        data: {},
      };
    }

    const role = new RoleEntity({
      name: createRole.name,
      description: createRole.description,
    });

    try {
      await this.entityManager.transaction(async (entityManager) => {
        await entityManager.save(role);
      });
      return {
        success: true,
        message: 'role' + name + 'created',
        data: { role: role },
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
