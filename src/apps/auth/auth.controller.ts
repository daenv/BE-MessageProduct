import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dtos';
import _ from 'underscore';

@Controller('auth')
export class AuthController {
  /**
   *
   */
  constructor(private readonly _authService: AuthService) {}

  @Post('login')
  public async login(@Body() loginDto: LoginDto) {
    const login = await this._authService.login(loginDto);
    return _.omit(login, 'password');
  }
  @Post('register')
  public async register(@Body() registerDto: CreateUserDto): Promise<unknown> {
    const register = await this._authService.register(registerDto);
    return _.omit(register, 'password');
  }
}
