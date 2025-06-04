import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ACCOUNT_PROPERTIES } from 'src/constants/documentation/account/dto';
import { Currency } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateAccountDto) {
  @ApiProperty({ ...ACCOUNT_PROPERTIES.currency, required: false })
  currency?: Currency;
}