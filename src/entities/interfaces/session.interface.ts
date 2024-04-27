import { IBaseEntity } from './base.interface';

export interface ISessionEntity extends IBaseEntity {
  token: string;
  expiresAt: Date;
}
