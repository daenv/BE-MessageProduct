import { Body, Controller, Post, Put, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dtos';
import _ from 'underscore';
import { RefreshTokenDto } from './dtos/refreshToken.dto';
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  /**
   *
   */
  constructor(private readonly _authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const login = await this._authService.login(loginDto, res);
    return _.omit(login, 'password');
  }
  @Post('register')
  public async register(@Body() registerDto: CreateUserDto): Promise<unknown> {
    const register = await this._authService.register(registerDto);
    return _.omit(register, 'password');
  }
  @Put('refresh-token')
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const refresh = await this._authService.refreshToken(refreshTokenDto);
    return _.omit(refresh, 'password');
  }
}
