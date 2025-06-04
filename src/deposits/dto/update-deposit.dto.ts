import { PartialType } from '@nestjs/mapped-types';
import { CreateDepositDto } from './create-deposit.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DEPOSIT_PROPERTIES } from 'src/constants/documentation/deposits/dto';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {
  @ApiProperty({ ...DEPOSIT_PROPERTIES.interestRate, required: false })
  interest_rate?: number;
} 