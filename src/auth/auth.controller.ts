import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import type { CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const isProd = process.env.NODE_ENV === 'production';

// В проде фронт (vercel.app) и API (onrender.com) на разных сайтах,
// поэтому нужны SameSite=None и Secure. Локально (http) это не работает,
// поэтому там lax без secure.
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      ...baseCookieOptions,
      maxAge: ACCESS_MAX_AGE,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...baseCookieOptions,
      maxAge: REFRESH_MAX_AGE,
    });
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(registerDto);
    this.setAuthCookies(res, tokens);
    return tokens;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginDto);
    this.setAuthCookies(res, tokens);
    return tokens;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Опции должны совпадать с теми, с которыми cookie ставились,
    // иначе браузер не удалит их.
    res.clearCookie('accessToken', baseCookieOptions);
    res.clearCookie('refreshToken', baseCookieOptions);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);
    this.setAuthCookies(res, tokens);
    return tokens;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Req()
    req: ExpressRequest & { user: { id: string; email: string; role: string } },
  ) {
    return req.user;
  }
}
