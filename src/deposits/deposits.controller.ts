import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { IUser } from 'src/constants/types/user/user';
import { DepositOwnerGuard } from 'src/common/guards/deposits/check-access.guard';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { DepositsService } from './deposits.service';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @UseGuards(JwtAuthGuard)
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
}