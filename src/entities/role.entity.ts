import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './bases';
import { IRoleEntity } from './interfaces';
import { UserEntity } from './user.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity implements IRoleEntity {
  @Column({ type: 'varchar', name: 'role_name' })
  name: string;
  @Column({ type: 'varchar', name: 'role_description' })
  description: string;
  @ManyToMany(() => UserEntity)
  users: UserEntity[];
}
