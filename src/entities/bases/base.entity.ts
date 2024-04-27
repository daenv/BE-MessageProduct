import { Column } from 'typeorm';
import { IdEntity } from './id.base.entity';
import { IBaseEntity } from '../interfaces/base.interface';

export abstract class BaseEntity extends IdEntity implements IBaseEntity {
  @Column({ type: 'boolean', default: false })
  isActive: boolean;
  @Column({ type: 'boolean', default: false })
  isArchived: boolean;
  @Column({ type: 'varchar', default: '' })
  createBy: string;
}
