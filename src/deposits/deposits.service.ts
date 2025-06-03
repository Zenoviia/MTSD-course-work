import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositNotFoundException } from 'src/exceptions/custom.exceptions';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountsService } from 'src/accounts/accounts.service';
import { SentTransactionsService } from 'src/sent-transactions/sent-transactions.service';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class DepositsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
    private readonly sentTransactionsService: SentTransactionsService,
  ) {}

  async create(user_id: number, account_id: number, dto: CreateDepositDto) {
    const { amount, interest_rate, start_date, end_date } = dto;

    return this.prisma.$transaction(async () => {
      const account = await this.accountsService.withdrawal(account_id, amount);

      await this.prisma.deposit.create({
        data: {
          user_id,
          account_id,
          amount,
          interest_rate,
          start_date,
          end_date,
        },
      });

      await this.sentTransactionsService.create({
        senderId: user_id,
        senderAccountId: account_id,
        amount,
        currency: account.currency,
      });
    });
  }

  async calculateFinalAmount(id: number) {
    const deposit = await this.findOneById(id);
    const { amount, interest_rate, start_date, end_date } = deposit;
    const years =
      (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24 * 365);

    const finalAmount = new Decimal(amount).mul(
      new Decimal(1).add(new Decimal(interest_rate).div(100)).pow(years),
    );
    return finalAmount;
  }

  async findOneById(deposit_id: number) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { deposit_id },
    });
    if (!deposit) throw new DepositNotFoundException();

    return deposit;
  }
}