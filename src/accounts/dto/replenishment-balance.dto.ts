import { IsNotEmpty, Matches } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';

export class ReplenishmentBalanceDto {
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be a positive number with up to two decimal places',
  })
  amount: string;
}