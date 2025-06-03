import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferException } from 'src/exceptions/custom.exceptions';
import { AccountsService } from 'src/accounts/accounts.service';
import { Decimal } from '@prisma/client/runtime/library';
import { IProcessTransaction } from 'src/constants/types/transactions/processTransaction';
import { ILogSentTransaction } from 'src/constants/types/transactions/logSentTransaction';
import { ILogReceivedTransaction } from 'src/constants/types/transactions/logReceivedTransaction';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
  ) {}

  async transfer(
    senderAccountId: number,
    dto: TransferFundsDto,
    senderId: number,
  ) {
    const { receiverAccountId, amount, currency } = dto;

    if (senderAccountId === receiverAccountId) throw new TransferException();

    return this.prisma.$transaction(async () => {
      const sender = await this.getAccount(senderAccountId);
      const receiver = await this.getAccount(receiverAccountId);

      this.checkBalance(sender.balance, amount);

      await this.processTransaction({
        senderAccountId,
        receiverAccountId,
        amount,
      });

      await this.logSentTransaction({
        senderId,
        senderAccountId,
        amount,
        currency,
      });

      await this.logReceivedTransaction({
        receiverId: receiver.user_id,
        receiverAccountId,
        amount,
        currency,
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

  async processTransaction(transaction: IProcessTransaction) {
    await this.accountsService.withdrawal(
      transaction.senderAccountId,
      transaction.amount,
    );
    await this.accountsService.replenishment(
      transaction.receiverAccountId,
      transaction.amount,
    );
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
}