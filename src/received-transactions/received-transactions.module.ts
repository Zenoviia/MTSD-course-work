import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReceivedTransactionsService } from './received-transactions.service';

@Module({
  imports: [PrismaModule],
  providers: [ReceivedTransactionsService],
  exports: [ReceivedTransactionsService],
})
export class ReceivedTransactionsModule {}