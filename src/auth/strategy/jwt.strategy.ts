import 'dotenv/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/constants/types/user/user';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
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
    await this.usersService.findOneById(user.user_id);
    return { user_id: user.user_id };
  }
}