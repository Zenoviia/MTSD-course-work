import { Currency } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class TransferFundsDto {
  @IsInt()
  receiverAccountId: number;

  @IsEnum(Currency, { message: 'Currency must be one of: USD, EUR, UAH' })
  currency: Currency;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;
}