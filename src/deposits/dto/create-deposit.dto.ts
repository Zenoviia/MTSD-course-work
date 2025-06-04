import { Type } from 'class-transformer';
import { IsNumber, IsDate, Min, IsNotEmpty, Matches } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';

export class CreateDepositDto {
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be a positive number with up to two decimal places',
  })
  amount: string;

  @IsNumber()
  @Min(0)
  interest_rate: number;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  end_date: Date;
}