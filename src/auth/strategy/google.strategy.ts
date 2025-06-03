import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { BCRYPT } from 'src/constants/enums/bcrypt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = {
      email: profile.emails[0].value,
      username: profile.displayName,
      password: bcrypt.hashSync('randomSecurePassword', BCRYPT.SALT),
      isEmailConfirmed: profile.emails[0].verified,
    };
    const validateUser = await this.authService.validateGoogleUser(user);
    done(null, validateUser);
  }
}