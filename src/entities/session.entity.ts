import { Column, Entity, ManyToOne } from 'typeorm';

import { ISessionEntity } from './interfaces';
import { UserEntity } from './user.entity';
import { IdEntity } from './bases/id.base.entity';

@Entity({ name: 'sessions' })
export class SessionEntity
  extends IdEntity<SessionEntity>
  implements ISessionEntity
{
  @Column({ type: 'varchar', name: 'token' })
  token: string;
  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;
  @ManyToOne(() => UserEntity, (user) => user.sessions)
  users: UserEntity;
}
