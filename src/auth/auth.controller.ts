import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieService } from 'src/cookie/cookie.service';
import { LocalAuthGuard } from 'src/common/guards/auth/local-auth.guard';
import { GoogleAuthGuard } from 'src/common/guards/auth/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const token = await this.authService.login(req.user);
    this.cookieService.setUserCookie(res, token);
    return res.send({ message: 'Logged in successfully' });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    return { message: 'Redirect to Google...' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req, @Response() res) {
    const token = await this.authService.login(req.user);
    this.cookieService.setUserCookie(res, token);
    return res.send({ message: 'Logged in successfully' });
  }
}