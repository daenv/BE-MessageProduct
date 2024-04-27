import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import _ from 'underscore';
import { CreateUserDto } from './dtos';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  public async login(): Promise<unknown> {
    const login = await this.authService.login();
    return _.omit(login, 'password');
  }
  public async logout(): Promise<unknown> {
    return;
  }
  @Post('register')
  public async register(
    @Body() _req: CreateUserDto,
    @Headers() _headers: any,
  ): Promise<unknown> {
    const register = await this.authService.register(_req, _headers);
    return _.omit(register, 'password');
  }
}
