import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ACCOUNT_PROPERTIES } from 'src/constants/documentation/account/dto';
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
}

export class GetBalanceDto {
  @ApiProperty(ACCOUNT_PROPERTIES.currency)
  @IsEnum(Currency, { message: 'Invalid currency' })
  currency: Currency;
}