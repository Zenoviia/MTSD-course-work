import 'dotenv/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/constants/types/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies?.jwt || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: String(process.env.JWT_SECRET_KEY),
    });
  }

  async validate(user: IUser) {
    return { user_id: user.user_id };
  }
}
