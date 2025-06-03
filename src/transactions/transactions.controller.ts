import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { AccountOwnerGuard } from 'src/common/guards/accounts/check-access.guard';
import { IUser } from 'src/constants/types/user/user';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard, AccountOwnerGuard)
  @Post(':accountId/transfer')
  async transfer(
    @Body() transferFundsDto: TransferFundsDto,
    @Param('accountId') id: string,
    @GetUser() user_id: IUser,
  ) {
    return await this.transactionsService.transfer(
      +id,
      transferFundsDto,
      +user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async transactionsHistory(@GetUser() id: IUser) {
    return await this.transactionsService.getHistory(+id);
  }
}