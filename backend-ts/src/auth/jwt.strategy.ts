import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getSecret } from './constants';
import { UserRepository } from '../entities/UserRepository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getSecret(),
    });
  }

  async validate(payload: any) {
    if (!payload.uid) {
      throw new UnauthorizedException();
    }
    let user = await this.userRepository.findOne({
      where: {
        id: payload.uid,
      },
    });
    return user;
  }
}
