import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user/get-user.decorator';
import { IUser } from 'src/constants/types/user/user';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountOwnerGuard } from 'src/common/guards/accounts/check-access.guard';
import { ReplenishmentBalanceDto } from './dto/replenishment-balance.dto';
import { Currency } from '@prisma/client';
import { ApiDocFor } from 'src/common/decorators/documentation/api-doc.decorator';
import { ACCOUNTS_API_DOCS } from 'src/constants/documentation/account/controller';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiDocFor(ACCOUNTS_API_DOCS.createAccount)
  @Post()
  async create(
    @GetUser() id: IUser,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return await this.accountService.create(+id, createAccountDto);
  }

  @UseGuards(JwtAuthGuard, AccountOwnerGuard)
  @ApiDocFor(ACCOUNTS_API_DOCS.closeAccount)
  @Delete(':accountId')
  async close(@Param('accountId') id: string) {
    return await this.accountService.close(+id);
  }

  @UseGuards(JwtAuthGuard, AccountOwnerGuard)
  @Patch(':accountId/replenishment')
  @ApiDocFor(ACCOUNTS_API_DOCS.replenishment)
  async replenishment(
    @Param('accountId') account_id: string,
    @Body() body: ReplenishmentBalanceDto,
    @GetUser() user_id: string,
  ) {
    return await this.accountService.replenishment(
      +account_id,
      +user_id,
      body.amount,
    );
  }

  @UseGuards(JwtAuthGuard, AccountOwnerGuard)
  @Patch(':accountId/withdrawal')
  @ApiDocFor(ACCOUNTS_API_DOCS.withdrawal)
  async withdrawal(
    @Param('accountId') account_id: string,
    @Body() body: ReplenishmentBalanceDto,
    @GetUser() user_id: string,
  ) {
    return await this.accountService.withdrawal(
      +account_id,
      +user_id,
      body.amount,
    );
  }

  @UseGuards(JwtAuthGuard, AccountOwnerGuard)
  @Get(':accountId/balance')
  @ApiDocFor(ACCOUNTS_API_DOCS.getBalance)
  async getBalance(
    @Param('accountId') account_id: string,
    @Query('currency', new ParseEnumPipe(Currency)) currency: Currency,
  ) {
    return await this.accountService.getBalance(+account_id, { currency });
  }
}