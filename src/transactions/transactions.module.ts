import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { CurrencyConverterModule } from 'src/currency-converter/currency-converter.module';
import { SentTransactionsModule } from 'src/sent-transactions/sent-transactions.module';
import { ReceivedTransactionsModule } from 'src/received-transactions/received-transactions.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AccountsModule,
    CurrencyConverterModule,
    SentTransactionsModule,
    ReceivedTransactionsModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}