import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsDate, Min, IsNotEmpty, Matches } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';
import { DEPOSIT_PROPERTIES } from 'src/constants/documentation/deposits/dto';

export class CreateDepositDto {
  @ApiProperty(DEPOSIT_PROPERTIES.amount)
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be a positive number with up to two decimal places',
  })
  amount: string;

  @ApiProperty(DEPOSIT_PROPERTIES.interestRate)
  @IsNumber()
  @Min(0)
  interest_rate: number;

  @ApiProperty(DEPOSIT_PROPERTIES.startDate)
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @ApiProperty(DEPOSIT_PROPERTIES.endDate)
  @Type(() => Date)
  @IsDate()
  end_date: Date;
}