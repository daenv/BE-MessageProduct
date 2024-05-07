import { Column, Entity } from 'typeorm';

import { IKeyTokenEntity } from './interfaces';
import { IdEntity } from './bases/id.base.entity';
@Entity({ name: 'key_tokens' })
export class KeyTokenEntity
  extends IdEntity<KeyTokenEntity>
  implements IKeyTokenEntity
{
  @Column({ type: 'varchar', name: 'publicKey' })
  publicKey: string;
  @Column({ name: 'refresh_token', type: 'varchar' })
  refreshToken: string[] = [];
}
