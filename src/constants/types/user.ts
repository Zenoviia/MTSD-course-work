import { CreateUserDto } from 'src/users/dto/create-user.dto';

export interface IUser {
  user_id: number;
}

export interface IGoogleUser extends CreateUserDto {
  isEmailConfirmed: boolean;
}