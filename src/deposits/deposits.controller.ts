import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { DepositsService } from './deposits.service';
import { GetUser } from 'src/common/decorators/user/get-user.decorator';
import { IUser } from 'src/constants/types/user/user';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { DepositOwnerGuard } from 'src/common/guards/deposits/check-access.guard';
import { AccountOwnerGuard } from 'src/common/guards/accounts/check-access.guard';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { AdminGuard } from 'src/common/guards/admin/check-access.guard';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @UseGuards(JwtAuthGuard, AccountOwnerGuard)
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
  @Get(':depositId/final-amount')
  async getFinalAmount(@Param('depositId') id: string) {
    return await this.depositsService.calculateFinalAmount(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':depositId/profit')
  async changeDepositProfit(
    @Param('depositId') id: string,
    @Body() depositUpdateDto: UpdateDepositDto,
  ) {
    return await this.depositsService.update(+id, depositUpdateDto);
  }
}