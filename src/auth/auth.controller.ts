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
import { ApiDocFor } from 'src/common/decorators/documentation/api-doc.decorator';
import { AUTH_API_DOCS } from 'src/constants/documentation/auth/controller';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiDocFor(AUTH_API_DOCS.login)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const token = await this.authService.login(req.user);
    this.cookieService.setUserCookie(res, token);
    return res.send({ message: 'Logged in successfully' });
  }

  @ApiDocFor(AUTH_API_DOCS.googleAuth)
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    return { message: 'Redirect to Google...' };
  }

  @ApiDocFor(AUTH_API_DOCS.googleAuthCallback)
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req, @Response() res) {
    const token = await this.authService.login(req.user);
    this.cookieService.setUserCookie(res, token);
    return res.send({ message: 'Logged in successfully' });
  }
}