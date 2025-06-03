import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferException } from 'src/exceptions/custom.exceptions';
import { AccountsService } from 'src/accounts/accounts.service';
import { Decimal } from '@prisma/client/runtime/library';
import { ILogSentTransaction } from 'src/constants/types/transactions/logSentTransaction';
import { ILogReceivedTransaction } from 'src/constants/types/transactions/logReceivedTransaction';
import { CurrencyConverterService } from 'src/currency-converter/currency-converter.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
    private readonly converterService: CurrencyConverterService,
  ) {}

  async transfer(
    senderAccountId: number,
    dto: TransferFundsDto,
    senderId: number,
  ) {
    const { receiverAccountId, amount } = dto;
    if (senderAccountId === receiverAccountId) throw new TransferException();

    return this.prisma.$transaction(async () => {
      const sender = await this.getAccount(senderAccountId);
      const receiver = await this.getAccount(receiverAccountId);

      this.checkBalance(sender.balance, amount);

      const convertedAmount = await this.converterService.convert(
        amount,
        sender.currency,
        receiver.currency,
      );

      await this.accountsService.withdrawal(senderAccountId, amount);
      await this.accountsService.replenishment(
        receiverAccountId,
        convertedAmount,
      );

      await this.logSentTransaction({
        senderId,
        senderAccountId,
        amount,
        currency: sender.currency,
      });

      await this.logReceivedTransaction({
        receiverId: receiver.user_id,
        receiverAccountId,
        amount: convertedAmount,
        currency: receiver.currency,
      });

      return { success: true };
    });
  }

  async getAccount(accountId: number) {
    const account = await this.accountsService.findOneById(accountId);
    return account;
  }

  checkBalance(balance: Decimal, amount: string) {
    if (new Decimal(balance).lessThan(amount)) {
      throw new BadRequestException('Insufficient funds');
    }
  }

  async logSentTransaction(transaction: ILogSentTransaction) {
    return this.prisma.sentTransaction.create({
      data: {
        sender_id: transaction.senderId,
        sender_account_id: transaction.senderAccountId,
        amount: transaction.amount,
        currency: transaction.currency,
      },
    });
  }

  async logReceivedTransaction(transaction: ILogReceivedTransaction) {
    return this.prisma.receivedTransaction.create({
      data: {
        receiver_id: transaction.receiverId,
        receiver_account_id: transaction.receiverAccountId,
        amount: transaction.amount,
        currency: transaction.currency,
      },
    });
  }

  async getDentTransactionsHistory(id: number) {
    return await this.prisma.sentTransaction.findMany({
      where: {
        sender_id: id,
      },
      include: {
        sender_account: { select: { account_id: true } },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getReceivedTransactionsHistory(id: number) {
    return await this.prisma.receivedTransaction.findMany({
      where: {
        receiver_id: id,
      },
      include: {
        receiver_account: { select: { account_id: true } },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getHistory(id: number) {
    const sentTransactions = await this.getDentTransactionsHistory(id);
    const receivedTransactions = await this.getReceivedTransactionsHistory(id);
    const allTransactions = [...sentTransactions, ...receivedTransactions];
    allTransactions.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime(),
    );
    return allTransactions;
  }
}