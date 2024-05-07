import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as JWT from 'jsonwebtoken';

import { CustomException } from 'src/common';
import { KeyTokenEntity } from 'src/entities';
import { KeyTokenRepository } from 'src/repositories';
import { ITokenPair } from './interfaces';

@Injectable()
export class KeytokenService {
  /**
   *
   */
  constructor(
    @InjectRepository(KeyTokenEntity)
    private readonly _keyTokenRepository: KeyTokenRepository,
  ) {}

  public async generateRsaKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
  }> {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        'rsa',
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        },
        (err, publicKey, privateKey) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              publicKey: publicKey.toString(),
              privateKey: privateKey.toString(),
            });
          }
        },
      );
    });
  }

  public async createTokenPair(
    payload: any,
    publicKey,
    privateKey,
  ): Promise<ITokenPair> {
    try {
      const accessToken = JWT.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
      });
      const refreshToken = JWT.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '7d',
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new CustomException(error);
    }
  }
  public async verifyToken(token: string, publicKey: string): Promise<any> {
    try {
      const decoded = await JWT.verify(token, publicKey);
      return decoded;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  public async createNewToken(payload: string): Promise<unknown> {
    try {
      const { publicKey, privateKey } = await this.generateRsaKeyPair();

      // create KeyToken
      const keyToken = await this.createTokenPair(
        { userId: payload },
        publicKey,
        privateKey,
      );
      return keyToken;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
