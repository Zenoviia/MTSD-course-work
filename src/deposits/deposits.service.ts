import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { DepositNotFoundException } from 'src/exceptions/custom.exceptions';
import { AccountsService } from 'src/accounts/accounts.service';
import { SentTransactionsService } from 'src/sent-transactions/sent-transactions.service';
import { calculateCompoundInterest } from 'src/utils/deposits/deposit';
import { UpdateDepositDto } from './dto/update-deposit.dto';

@Injectable()
export class DepositsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
  ) {}

  async create(user_id: number, account_id: number, dto: CreateDepositDto) {
    const { amount, interest_rate, start_date, end_date } = dto;

    return this.prisma.$transaction(async () => {
      await this.accountsService.withdrawal(account_id, user_id, amount);
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

      return { success: true };
    });
  }

  async calculateFinalAmount(id: number) {
    const deposit = await this.findOneById(id);
    const { amount, interest_rate, start_date, end_date } = deposit;

    const finalAmount = calculateCompoundInterest(
      String(amount),
      interest_rate,
      start_date,
      end_date,
    );

    return { finalAmount };
  }

  async findOneById(deposit_id: number) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { deposit_id },
    });
    if (!deposit) throw new DepositNotFoundException();

    return deposit;
  }

  async update(deposit_id: number, dto: UpdateDepositDto) {
    await this.findOneById(deposit_id);
    await this.prisma.deposit.update({
      where: { deposit_id },
      data: dto,
    });

    return `Deposit ${deposit_id} update successfully`;
  }
}