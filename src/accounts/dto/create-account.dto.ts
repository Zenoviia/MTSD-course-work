import { Currency } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateAccountDto {
  @IsEnum(Currency, { message: 'Currency must be one of: USD, EUR, UAH etc' })
  currency: Currency;
}