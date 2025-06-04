import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CurrencyConverterService } from '../currency-converter/currency-converter.service';
import { SentTransactionsService } from '../sent-transactions/sent-transactions.service';
import { ReceivedTransactionsService } from '../received-transactions/received-transactions.service';
import { formatTransactions } from '../utils/transactions/transactions';
import { TransferException } from '../exceptions/transfers/transfers';

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

  async getHistory(id: number) {
    const sent = await this.sentTransactionsService.getHistory(id);
    const received = await this.receivedTransactionsService.getHistory(id);
    return formatTransactions(sent, received);
  }
}