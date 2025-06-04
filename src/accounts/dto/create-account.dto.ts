import { ApiProperty } from '@nestjs/swagger';
// Define Currency enum locally if not exported from @prisma/client
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
  // add other currencies as needed
}
import { IsEnum } from 'class-validator';
import { ACCOUNT_PROPERTIES } from 'src/constants/documentation/account/dto';

export class CreateAccountDto {
  @ApiProperty(ACCOUNT_PROPERTIES.currency)
  @IsEnum(Currency, { message: 'Currency must be one of: USD, EUR, UAH etc' })
  currency: Currency;
}