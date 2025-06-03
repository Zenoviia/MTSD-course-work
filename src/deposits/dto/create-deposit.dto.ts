import {
  IsInt,
  IsNumber,
  IsDate,
  Min,
  IsPositive,
  IsNumberString,
  IsNotEmpty,
} from 'class-validator';

export class CreateDepositDto {
  @IsInt()
  account_id: number;

  @IsNotEmpty()
  @IsNumberString()
  @IsPositive()
  amount: string;

  @IsNumber()
  @Min(0)
  interest_rate: number;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;
}