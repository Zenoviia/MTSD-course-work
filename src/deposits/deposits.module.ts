import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, AccountsModule, UsersModule],
  providers: [DepositsService],
  controllers: [DepositsController],
})
export class DepositsModule {}