import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/auth/jwt-auth.guard';
import { DepositsService } from './deposits.service';
import { GetUser } from '../common/decorators/user/get-user.decorator';
import { IUser } from '../constants/types/user/user';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { DepositOwnerGuard } from '../common/guards/deposits/check-access.guard';
import { AccountOwnerGuard } from '../common/guards/accounts/check-access.guard';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { AdminGuard } from '../common/guards/admin/check-access.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocFor } from '../common/decorators/documentation/api-doc.decorator';
import { DEPOSITS_API_DOCS } from '../constants/documentation/deposits/controller';

@ApiTags('Deposits')
@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @UseGuards(JwtAuthGuard, AccountOwnerGuard)
  @ApiDocFor(DEPOSITS_API_DOCS.createDeposit)
  @Post(':accountId')
  async create(
    @Body() depositFundsDto: CreateDepositDto,
    @GetUser() user_id: IUser,
    @Param('accountId') account_id: string,
  ) {
    return await this.depositsService.create(
      +user_id,
      +account_id,
      depositFundsDto,
    );
  }

  @UseGuards(JwtAuthGuard, DepositOwnerGuard)
  @ApiDocFor(DEPOSITS_API_DOCS.getFinalAmount)
  @Get(':depositId/final-amount')
  async getFinalAmount(@Param('depositId') id: string) {
    return await this.depositsService.calculateFinalAmount(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiDocFor(DEPOSITS_API_DOCS.changeDepositProfit)
  @Patch(':depositId/profit')
  async changeDepositProfit(
    @Param('depositId') id: string,
    @Body() depositUpdateDto: UpdateDepositDto,
  ) {
    return await this.depositsService.update(+id, depositUpdateDto);
  }
}