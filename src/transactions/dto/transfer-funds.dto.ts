import { IsEnum, IsInt, IsNotEmpty, IsNumberString } from 'class-validator';

export class TransferFundsDto {
  @IsInt()
  receiverAccountId: number;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;
}