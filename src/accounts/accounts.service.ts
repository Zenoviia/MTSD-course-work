import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  AccountBalanceException,
  AccountNotFoundException,
} from 'src/exceptions/custom.exceptions';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: number, createAccountDto: CreateAccountDto) {
    return await this.prisma.account.create({
      data: {
        user_id: id,
        currency: createAccountDto.currency,
      },
    });
  }

  async findOneById(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { account_id: id },
    });
    if (!account) throw new AccountNotFoundException();
    return account;
  }

  async close(id: number) {
    const account = await this.findOneById(id);
    if (!account.balance) throw new AccountBalanceException();
    return await this.prisma.account.delete({ where: { account_id: id } });
  }

  async replenishment(id: number, balance: string) {
    await this.findOneById(id);
    return await this.prisma.account.update({
      where: { account_id: id },
      data: { balance: { increment: parseFloat(balance) } },
    });
  }

  async withdrawal(id: number, balance: string) {
    await this.findOneById(id);
    return await this.prisma.account.update({
      where: { account_id: id },
      data: { balance: { decrement: parseFloat(balance) } },
    });
  }
}