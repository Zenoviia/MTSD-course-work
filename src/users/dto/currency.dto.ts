import { Currency } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class GetBalanceDto {
  @IsEnum(Currency, { message: 'Invalid currency' })
  currency: Currency;
}