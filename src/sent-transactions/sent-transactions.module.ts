import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SentTransactionsService } from './sent-transactions.service';

@Module({
  imports:[PrismaModule],
  providers: [SentTransactionsService],
  exports:[SentTransactionsService]
})
export class SentTransactionsModule {}