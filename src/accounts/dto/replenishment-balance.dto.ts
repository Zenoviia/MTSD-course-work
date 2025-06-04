import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';
import { ACCOUNT_PROPERTIES } from 'src/constants/documentation/account/dto';

export class ReplenishmentBalanceDto {
  @ApiProperty(ACCOUNT_PROPERTIES.amount)
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be a positive number with up to two decimal places',
  })
  amount: string;
}