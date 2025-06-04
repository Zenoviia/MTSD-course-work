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

  @ApiDocFor(USER_API_DOCS.register)
  @Post('registration')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiDocFor(USER_API_DOCS.confirmEmail)
  @Post('confirm')
  async confirmEmail(@Query('token') token: string, @Response() res) {
    const confirmEmail = await this.usersService.confirmEmail(token);
    this.cookieService.setUserCookie(res, token);
    return res.send(confirmEmail);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiDocFor(USER_API_DOCS.getAllUsers)
  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiDocFor(USER_API_DOCS.getUserDetails)
  @Get(':userId')
  async getOneFullInfo(@Param('userId') id: string) {
    return await this.usersService.findFullInfoById(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiDocFor(USER_API_DOCS.blockUser)
  @Patch(':userId/blocked')
  async getBlocked(
    @Param('userId') id: string,
    @Body() updateUsersDto: UpdateUserDto,
    @Response() res,
  ) {
    return res.send(await this.usersService.update(+id, updateUsersDto));
  }
}