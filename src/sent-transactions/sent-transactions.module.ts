import { Module } from '@nestjs/common';
import { SentTransactionsService } from './sent-transactions.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SentTransactionsService],
  exports: [SentTransactionsService],
})
export class SentTransactionsModule {}