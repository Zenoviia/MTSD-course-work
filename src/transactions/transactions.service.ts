import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferException } from 'src/exceptions/custom.exceptions';
import { AccountsService } from 'src/accounts/accounts.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CurrencyConverterService } from 'src/currency-converter/currency-converter.service';
import { SentTransactionsService } from 'src/sent-transactions/sent-transactions.service';
import { ReceivedTransactionsService } from 'src/received-transactions/received-transactions.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
    private readonly converterService: CurrencyConverterService,
    private readonly sentTransactionsService: SentTransactionsService,
    private readonly receivedTransactionsService: ReceivedTransactionsService,
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

      await this.sentTransactionsService.create({
        senderId,
        senderAccountId,
        amount,
        currency: sender.currency,
      });

      await this.receivedTransactionsService.create({
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

  async getHistory(id: number) {
    const sent = await this.sentTransactionsService.getHistory(id);
    const received = await this.receivedTransactionsService.getHistory(id);
    const allTransactions = [...sent, ...received];
    allTransactions.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime(),
    );
    return allTransactions;
  }
}