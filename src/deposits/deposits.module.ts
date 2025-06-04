import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, AccountsModule, UsersModule],
  providers: [DepositsService],
  controllers: [DepositsController],
})
export class DepositsModule {}