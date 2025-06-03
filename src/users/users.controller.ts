import { Body, Controller, Post, Query, Response } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CookieService } from 'src/cookie/cookie.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('registration')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('confirm')
  async confirmEmail(@Query('token') token: string, @Response() res) {
    const confirmEmail = await this.usersService.confirmEmail(token);
    this.cookieService.setUserCookie(res, token);
    return res.send(confirmEmail);
  }
}