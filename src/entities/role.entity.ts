import { Column, Entity } from 'typeorm';

import { IRoleEntity } from './interfaces';
import { IdEntity } from './bases/id.base.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends IdEntity<RoleEntity> implements IRoleEntity {
  @Column({ type: 'varchar', name: 'role_name' })
  name: string;
  @Column({ type: 'varchar', name: 'role_description' })
  description: string;
}
