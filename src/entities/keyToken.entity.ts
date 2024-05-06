import { Column, Entity } from 'typeorm';
import { BaseEntity } from './bases';
import { IKeyTokenEntity } from './interfaces';
@Entity({ name: 'key_tokens' })
export class KeyTokenEntity extends BaseEntity implements IKeyTokenEntity {
  @Column({ type: 'varchar', name: 'publicKey' })
  publicKey: string;
  @Column({ name: 'refresh_token', type: 'varchar' })
  refreshToken: string[] = [];
}
