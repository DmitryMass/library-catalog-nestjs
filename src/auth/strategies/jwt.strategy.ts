import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // бессрочный токен
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
