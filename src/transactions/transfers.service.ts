import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferException } from 'src/exceptions/custom.exceptions';
import { AccountsService } from 'src/accounts/accounts.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CurrencyConverterService } from 'src/currency-converter/currency-converter.service';
import { SentTransactionsService } from 'src/sent-transactions/sent-transactions.service';
import { ReceivedTransactionsService } from 'src/received-transactions/received-transactions.service';
import { formatTransactions } from 'src/utils/transactions/transactions';

@Injectable()
export class TransfersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
    private readonly converterService: CurrencyConverterService,
    private readonly sentTransactionsService: SentTransactionsService,
    private readonly receivedTransactionsService: ReceivedTransactionsService,
  ) {}

  async create(
    senderAccountId: number,
    senderId: number,
    dto: TransferFundsDto,
  ) {
    const { receiverAccountId, amount } = dto;
    if (senderAccountId === receiverAccountId) throw new TransferException();

    return this.prisma.$transaction(async () => {
      const sender = await this.getAccount(senderAccountId);
      this.checkBalance(sender.balance, amount);
      const receiver = await this.getAccount(receiverAccountId);

      const convertedAmount = await this.converterService.convert(
        amount,
        sender.currency,
        receiver.currency,
      );

      await this.accountsService.withdrawal(senderAccountId, senderId, amount);
      await this.accountsService.replenishment(
        receiverAccountId,
        receiver.user_id,
        convertedAmount,
      );

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
    return formatTransactions(sent, received);
  }
}