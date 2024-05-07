import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IIdEntity } from '../interfaces/id.interface';

export class IdEntity<T> implements IIdEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn({ type: 'timestamptz' })
  createDateTime: Date;
  @CreateDateColumn({ type: 'timestamptz' })
  lastChangedDateTime: Date;
  @Column({ type: 'boolean', default: false })
  isActive: boolean;
  @Column({ type: 'boolean', default: false })
  isArchived: boolean;
  @Column({ type: 'varchar', default: '' })
  createBy: string;
  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
