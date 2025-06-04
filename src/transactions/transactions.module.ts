import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransactionsController } from './transfers.controller';
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
  providers: [TransfersService],
  controllers: [TransactionsController],
  exports: [TransfersService],
})
export class TransfersModule {}