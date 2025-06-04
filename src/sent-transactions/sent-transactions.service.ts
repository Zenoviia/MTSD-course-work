import { Injectable } from '@nestjs/common';
import { ILogSentTransaction } from 'src/constants/types/transactions/logSentTransaction';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SentTransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: ILogSentTransaction) {
    return await this.prisma.sentTransaction.create({
      data: {
        sender_id: transaction.senderId,
        sender_account_id: transaction.senderAccountId,
        amount: transaction.amount,
        currency: transaction.currency,
      },
    });
  }

  async getHistory(id: number) {
    return await this.prisma.sentTransaction.findMany({
      where: {
        sender_id: id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}