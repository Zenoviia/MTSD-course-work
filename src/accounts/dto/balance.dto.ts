import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ACCOUNT_PROPERTIES } from 'src/constants/documentation/account/dto';

export class GetBalanceDto {
  @ApiProperty(ACCOUNT_PROPERTIES.currency)
  @IsEnum(Currency, { message: 'Invalid currency' })
  currency: Currency;
}