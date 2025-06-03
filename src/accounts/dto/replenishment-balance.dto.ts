import { IsNotEmpty, IsNumberString } from 'class-validator';

export class ReplenishmentBalanceDto {
  @IsNotEmpty()
  @IsNumberString()
  amount: string;
}