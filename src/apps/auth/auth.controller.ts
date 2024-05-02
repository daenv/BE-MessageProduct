import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import _ from 'underscore';
import { CreateUserDto, LoginDto } from './dtos';
import { MessageResponse } from 'src/common/interfaces';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<unknown> {
    const login = await this.authService.login(loginDto);
    return _.omit(login, 'password');
  }
  public async logout(): Promise<unknown> {
    return;
  }
  @Post('register')
  public async register(@Body() _req: CreateUserDto): Promise<MessageResponse> {
    const register = await this.authService.register(_req);
    return _.omit(register, 'password');
  }
}
