import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransactionsController } from './transfers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';
import { CurrencyConverterModule } from '../currency-converter/currency-converter.module';
import { SentTransactionsModule } from '../sent-transactions/sent-transactions.module';
import { ReceivedTransactionsModule } from '../received-transactions/received-transactions.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AccountsModule,
    CurrencyConverterModule,
    SentTransactionsModule,
    ReceivedTransactionsModule,
  ],
  providers: [TransfersService],
  controllers: [TransactionsController],
  exports: [TransfersService],
})
export class TransfersModule {}