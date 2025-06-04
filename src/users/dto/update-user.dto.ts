import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { USER_PROPERTIES } from 'src/constants/documentation/user/dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty(USER_PROPERTIES.is_blocked)
  @IsOptional()
  @IsBoolean()
  is_blocked: boolean;
}