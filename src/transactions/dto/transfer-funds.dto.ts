import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Matches } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';
import { TRANSFER_PROPERTIES } from 'src/constants/documentation/transfers/dto';

export class TransferFundsDto {
  @ApiProperty(TRANSFER_PROPERTIES.receiverAccountId)
  @IsInt()
  receiverAccountId: number;

  @ApiProperty(TRANSFER_PROPERTIES.amount)
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be a positive number with up to two decimal places',
  })
  amount: string;
}