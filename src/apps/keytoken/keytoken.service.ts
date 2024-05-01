import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as JWT from 'jsonwebtoken';

import { ITokenPair } from './interfaces';
import { CustomException, MessageResponse } from 'src/common';
import { KeyTokenEntity } from 'src/entities';
import { KeyTokenRepository } from 'src/repositories';

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

  public async saveKeyToken(
    token: string,
    publicKey: string,
  ): Promise<MessageResponse> {
    try {
      const decoded = await this.verifyToken(token, publicKey);
      const saveKeyToken = await this._keyTokenRepository.save({
        publicKey: publicKey,
        refreshToken: [token],
        users: decoded.userId,
      });
      return {
        message: 'KeyToken saved successfully',
        data: saveKeyToken.refreshToken,
        success: true,
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
