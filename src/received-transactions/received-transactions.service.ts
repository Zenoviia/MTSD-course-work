import { Injectable } from '@nestjs/common';
import { ILogReceivedTransaction } from 'src/constants/types/transactions/logReceivedTransaction';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReceivedTransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async logTransaction(transaction: ILogReceivedTransaction) {
    return await this.prisma.receivedTransaction.create({
      data: {
        receiver_id: transaction.receiverId,
        receiver_account_id: transaction.receiverAccountId,
        amount: transaction.amount,
        currency: transaction.currency,
      },
    });
  }

  async getHistory(id: number) {
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
}