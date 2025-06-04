import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user/get-user.decorator';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { AccountOwnerGuard } from 'src/common/guards/accounts/check-access.guard';
import { IUser } from 'src/constants/types/user/user';
import { AdminGuard } from 'src/common/guards/admin/check-access.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocFor } from 'src/common/decorators/documentation/api-doc.decorator';
import { TRANSFERS_API_DOCS } from 'src/constants/documentation/transfers/controller';

@ApiTags('Transfers')
@Controller('transfers')
export class TransactionsController {
  constructor(private readonly transactionsService: TransfersService) {}

  @UseGuards(JwtAuthGuard, AccountOwnerGuard)
  @Post(':accountId')
  @ApiDocFor(TRANSFERS_API_DOCS.create)
  async create(
    @Body() transferFundsDto: TransferFundsDto,
    @Param('accountId') account_id: string,
    @GetUser() user_id: IUser,
  ) {
    return await this.transactionsService.create(
      +account_id,
      +user_id,
      transferFundsDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiDocFor(TRANSFERS_API_DOCS.transactionsHistory)
  async transactionsHistory(@GetUser() id: IUser) {
    return await this.transactionsService.getHistory(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiDocFor(TRANSFERS_API_DOCS.getUserHistory)
  @Get(':userId/history')
  async getUserHistory(@Param('userId') id: string) {
    return await this.transactionsService.getHistory(+id);
  }
}