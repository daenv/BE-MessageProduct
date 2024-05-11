import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/common';
import { SessionEntity } from 'src/entities';
import { SessionRepository } from 'src/repositories';

@Injectable()
export class SessionsService {
  /**
   *
   */
  constructor(
    @InjectRepository(SessionEntity)
    private readonly _sessionRepository: SessionRepository,
  ) {}

  public async findSession(token: string): Promise<SessionEntity> {
    try {
      const session = await this._sessionRepository.findOne({
        where: {
          token: token,
        },
        relations: ['users'],
      });
      console.log('session::', session);
      return session;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
