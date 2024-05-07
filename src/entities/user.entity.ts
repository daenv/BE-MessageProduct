import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { IUserEntity } from './interfaces';
import { SessionEntity } from './session.entity';
import { RoleEntity } from './role.entity';
import { KeyTokenEntity } from './keyToken.entity';
import { IdEntity } from './bases/id.base.entity';

@Entity({ name: 'users' })
export class UserEntity extends IdEntity<UserEntity> implements IUserEntity {
  @Index('IX_USER_USERNAME', { unique: true })
  @Column({ type: 'varchar', name: 'username' })
  username: string;
  @Index('IX_USER_EMAIL', { unique: true })
  @Column({ type: 'varchar', name: 'email' })
  email: string;
  @Column({ type: 'varchar', name: 'password' })
  password: string;
  @OneToMany(() => SessionEntity, (session) => session.lastChangedDateTime)
  sessions: SessionEntity[];

  @ManyToMany(() => RoleEntity, { cascade: true })
  @JoinTable()
  roles: RoleEntity[];

  @ManyToMany(() => KeyTokenEntity, { cascade: true })
  @JoinTable()
  keyTokens: KeyTokenEntity[];
}
