import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CookieService } from 'src/cookie/cookie.service';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { IUser } from 'src/constants/types/user/user';
import { Currency } from '@prisma/client';

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

  @UseGuards(JwtAuthGuard)
  @Get('/balance')
  async getBalance(
    @Query('currency', new ParseEnumPipe(Currency)) currency: Currency,
    @GetUser() id: IUser,
  ) {
    return await this.usersService.getBalance(+id, { currency });
  }
}