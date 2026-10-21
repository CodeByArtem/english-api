import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request && request.cookies ? request.cookies['accessToken'] : null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const s = configService.get<string>('JWT_ACCESS_SECRET');
        if (!s) throw new Error('JWT_ACCESS_SECRET environment variable is required');
        return s;
      })(),
    });
  }

  async validate(payload: any) {
    try {
      return { id: payload.sub, email: payload.email, role: payload.role };
    } catch (error) {
      console.error('JWT validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
