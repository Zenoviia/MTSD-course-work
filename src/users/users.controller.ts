import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CookieService } from 'src/cookie/cookie.service';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin/check-access.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocFor } from 'src/common/decorators/documentation/api-doc.decorator';
import { USER_API_DOCS } from 'src/constants/documentation/user/controller';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('registration')
  @ApiDocFor(USER_API_DOCS.register)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('confirm')
  @ApiDocFor(USER_API_DOCS.confirmEmail)
  async confirmEmail(@Query('token') token: string, @Response() res) {
    const confirmEmail = await this.usersService.confirmEmail(token);
    this.cookieService.setUserCookie(res, token);
    return res.send(confirmEmail);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  @ApiDocFor(USER_API_DOCS.getAllUsers)
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':userId')
  @ApiDocFor(USER_API_DOCS.getUserDetails)
  async getOneFullInfo(@Param('userId') id: string) {
    return await this.usersService.findFullInfoById(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':userId/blocked')
  @ApiDocFor(USER_API_DOCS.blockUser)
  async getBlocked(
    @Param('userId') id: string,
    @Body() updateUsersDto: UpdateUserDto,
    @Response() res,
  ) {
    this.cookieService.setUserCookie(res, '');
    return res.send(await this.usersService.update(+id, updateUsersDto));
  }
}