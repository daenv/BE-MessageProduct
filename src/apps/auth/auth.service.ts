import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos';

@Injectable()
export class AuthService {
  public async login() {}
  public async register(_req: CreateUserDto, header: any): Promise<unknown> {
    console.log(header);
    console.log(_req);
    return;
  }
}
