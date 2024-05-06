import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './bases';
import { ISessionEntity } from './interfaces';
import { UserEntity } from './user.entity';

@Entity({ name: 'sessions' })
export class SessionEntity extends BaseEntity implements ISessionEntity {
  @Column({ type: 'varchar', name: 'token' })
  token: string;
  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;
  @ManyToOne(() => UserEntity, (user) => user.sessions)
  users: UserEntity;
}
