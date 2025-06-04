import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SentTransactionsModule } from '../sent-transactions/sent-transactions.module';
import { ReceivedTransactionsModule } from '../received-transactions/received-transactions.module';
import { CurrencyConverterModule } from '../currency-converter/currency-converter.module';

@Module({
  imports: [
    PrismaModule,
    SentTransactionsModule,
    ReceivedTransactionsModule,
    CurrencyConverterModule,
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}