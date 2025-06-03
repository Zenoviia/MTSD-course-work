import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { CurrencyConverterModule } from 'src/currency-converter/currency-converter.module';

@Module({
  imports: [PrismaModule, UsersModule, AccountsModule, CurrencyConverterModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}