import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, AccountsModule],
})
export class RolesModule {}