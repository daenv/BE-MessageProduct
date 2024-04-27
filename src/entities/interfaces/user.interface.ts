import { IBaseEntity } from './base.interface';

export interface IUserEntity extends IBaseEntity {
  username: string;
  email: string;
  password: string;
}
