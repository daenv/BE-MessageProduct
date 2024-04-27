import { IIdEntity } from './id.interface';

export interface IBaseEntity extends IIdEntity {
  isActive: boolean;
  isArchived: boolean;
  createBy: string;
}
