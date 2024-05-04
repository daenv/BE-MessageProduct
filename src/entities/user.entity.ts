import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './bases';
import { IUserEntity } from './interfaces';
import { SessionEntity } from './session.entity';
import { RoleEntity } from './role.entity';
import { KeyTokenEntity } from './keyToken.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUserEntity {
  @Index('IX_USER_USERNAME', { unique: true })
  @Column({ type: 'varchar', name: 'username' })
  username: string;
  @Index('IX_USER_EMAIL', { unique: true })
  @Column({ type: 'varchar', name: 'email' })
  email: string;
  @Column({ type: 'varchar', name: 'password' })
  password: string;
  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @ManyToMany(() => RoleEntity)
  @JoinTable()
  roles: RoleEntity[];

  @OneToOne(() => KeyTokenEntity)
  @JoinTable()
  keyTokens: KeyTokenEntity[];
}
