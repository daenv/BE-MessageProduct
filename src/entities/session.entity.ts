import { Column, Entity } from 'typeorm';
import { BaseEntity } from './bases';
import { ISessionEntity } from './interfaces';

@Entity({ name: 'sessions' })
export class SessionEntity extends BaseEntity implements ISessionEntity {
  @Column({ type: 'varchar', name: 'token' })
  token: string;
  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;
}
