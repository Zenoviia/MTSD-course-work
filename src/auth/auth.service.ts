import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { IGoogleUser, IUser } from '../constants/types/user/user';
import { JwtService } from '@nestjs/jwt';
import { EmailConfirmException } from '../exceptions/users/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: IUser) {
    const payload = {
      user_id: user.user_id,
      sub: user.user_id,
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateGoogleUser(profile: IGoogleUser) {
    if (!profile.is_email_confirm) throw new EmailConfirmException();
    return await this.usersService.createByGoogle(profile);
  }
}