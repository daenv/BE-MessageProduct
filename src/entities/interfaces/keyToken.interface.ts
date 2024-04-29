import { IBaseEntity } from './base.interface';

export interface IKeyTokenEntity extends IBaseEntity {
  publicKey: string;
  refreshToken: string[];
}
