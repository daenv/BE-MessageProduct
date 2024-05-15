import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import _ from 'underscore';
@Controller('roles')
export class RolesController {
  /**
   *
   */
  constructor(private readonly _roleService: RolesService) {}
  @Post('')
  public async createRole(
    @Body() createRole: CreateRoleDto,
    @Req() req: Request,
  ): Promise<unknown> {
    const create = await this._roleService.createRole(createRole, req);
    return _.omit(create, 'id');
  }
}
