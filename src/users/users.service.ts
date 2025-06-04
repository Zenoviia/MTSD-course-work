import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BCRYPT } from '../constants/enums/bcrypt/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { EMAIL } from '../constants/enums/email/email';
import { EmailService } from '../email/email.service';
import {
  BlockUserException,
  EmailConfirmException,
  UserForbiddenException,
  UserNotFoundException,
} from '../exceptions/users/users';
import { TokenException } from '../exceptions/token/token';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email, username } = createUserDto;
    const hashPassword = await bcrypt.hash(password, BCRYPT.SALT);
    await this.checkUserExists(email, username);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashPassword,
      },
    });

    this.checkUserBlocked(user.is_blocked);

    const token = this.jwtService.sign({
      user_id: user.user_id,
      sub: user.user_id,
    });

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
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
    });
    if (!user) throw new UserNotFoundException();
    this.checkUserBlocked(user.is_blocked);

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UserNotFoundException();
    if (!user.is_email_confirm) throw new EmailConfirmException();
    this.checkUserBlocked(user.is_blocked);

    return user;
  }

  async createByGoogle(profile: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });
    if (!user) return await this.create(profile);
    this.checkUserBlocked(user.is_blocked);

    return user;
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    await this.findOneById(user_id);
    await this.prisma.user.update({
      where: { user_id },
      data: updateUserDto,
    });
    return `User ${user_id} update successfully`;
  }

  async findOverdue() {
    return await this.prisma.user.findMany({
      where: {
        is_email_confirm: false,
      },
    });
  }

  async removeOverdue(user_id: number) {
    await this.findOneById(user_id);
    return await this.prisma.user.delete({ where: { user_id } });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async findFullInfoById(user_id: number) {
    await this.findOneById(user_id);
    const user = await this.prisma.user.findUnique({
      where: { user_id },
      include: {
        accounts: true,
        deposits: true,
        transactions: true,
        received_transactions: true,
      },
    });
    return user;
  }

  private async checkUserExists(email: string, username: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) throw new UserForbiddenException();
  }

  private checkUserBlocked(is_blocked: boolean) {
    if (is_blocked) throw new BlockUserException();
  }
}