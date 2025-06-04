import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

import { SentTransactionsService } from 'src/sent-transactions/sent-transactions.service';
import { ReceivedTransactionsService } from 'src/received-transactions/received-transactions.service';
import { GetBalanceDto } from './dto/balance.dto';
import { CurrencyConverterService } from 'src/currency-converter/currency-converter.service';
import {
  AccountBalanceException,
  AccountNotFoundException,
} from 'src/exceptions/accounts/accounts';

@Injectable()
export class AccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly converterService: CurrencyConverterService,
    private readonly sentTransactionsService: SentTransactionsService,
    private readonly receivedTransactionsService: ReceivedTransactionsService,
  ) {}

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

  async replenishment(account_id: number, user_id: number, amount: string) {
    await this.findOneById(account_id);
    const account = await this.prisma.account.update({
      where: { account_id },
      data: { balance: { increment: parseFloat(amount) } },
    });

    await this.receivedTransactionsService.create({
      receiverId: user_id,
      receiverAccountId: account_id,
      amount,
      currency: account.currency,
    });

    return account;
  }

  async withdrawal(account_id: number, user_id: number, amount: string) {
    await this.findOneById(account_id);
    const account = await this.prisma.account.update({
      where: { account_id },
      data: { balance: { decrement: parseFloat(amount) } },
    });

    await this.sentTransactionsService.create({
      senderId: user_id,
      senderAccountId: account_id,
      amount,
      currency: account.currency,
    });

    return account;
  }

  async getBalance(account_id: number, { currency }: GetBalanceDto) {
    const account = await this.findOneById(account_id);
    const convertedAmount = await this.converterService.convert(
      String(account.balance),
      account.currency,
      currency,
    );
    return { balance: convertedAmount, currency: currency };
  }
}