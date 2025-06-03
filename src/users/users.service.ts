import * as bcrypt from 'bcryptjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BCRYPT } from 'src/constants/enums/bcrypt';
import {
  TokenException,
  UserCreateException,
  UserNotFoundException,
} from 'src/exceptions/custom.exceptions';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { EMAIL } from 'src/constants/enums/email';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashPassword = await bcrypt.hash(password, BCRYPT.SALT);

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashPassword,
      },
    });
    if (!user) throw new UserCreateException();
    const payload = {
      user_id: user.user_id,
      sub: user.user_id,
    };
    const token = this.jwtService.sign(payload);
    await this.emailService.sendConfirmationEmail(user.email, token);
    return { message: 'Logged in successfully' };
  }

  async confirmEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.findOneById(decoded.user_id);

      user.is_email_confirm = true;
      await this.update(decoded.user_id, user);

      return EMAIL.CONFIRM_SUCCESS;
    } catch (error) {
      throw new TokenException();
    }
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { user_id: id } });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async createByGoogle(profile: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: profile,
    });
    if (!user) throw new UserCreateException();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateUser = await this.prisma.user.update({
      where: { user_id: id },
      data: updateUserDto,
    });
    if (!updateUser) throw new UserCreateException();
    return `User ${id} update successfully`;
  }

  async findOverdue() {
    return await this.prisma.user.findMany({
      where: {
        is_email_confirm: false,
      },
    });
  }

  async removeOverdue(usersToDelete) {
    return await this.prisma.user.delete(usersToDelete);
  }
}