import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_PROPERTIES } from 'src/constants/documentation/user/dto';

export class CreateUserDto {
  @ApiProperty(USER_PROPERTIES.username)
  @IsString()
  username: string;

  @ApiProperty(USER_PROPERTIES.email)
  @IsEmail()
  email: string;

  @ApiProperty(USER_PROPERTIES.password)
  @IsString()
  @MinLength(6)
  password: string;
}