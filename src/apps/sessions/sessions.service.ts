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

  public async findSessionByToken(token: string): Promise<SessionEntity> {
    try {
      const session = await this._sessionRepository.findOne({
        where: {
          token: token,
        },
        relations: ['users'],
      });
      return session;
    } catch (error) {
      throw new CustomException(error);
    }
  }
  public async findSessionById(id: string): Promise<SessionEntity> {
    const session = await this._sessionRepository.findOne({
      where: {
        id: id,
      },
      relations: ['users'],
    });
    return session;
  }
  catch(error) {
    throw new CustomException(error);
  }
  public async updateSession(
    id: string,
    token: string,
  ): Promise<SessionEntity> {
    try {
      const session = await this.findSessionById(id);
      session.expiresAt = new Date();
      session.token = token;
      await this._sessionRepository.save(session);
      return session;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
