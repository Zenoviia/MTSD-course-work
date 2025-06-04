import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const admin = await this.userService.findOneById(+user.user_id);

    if (admin.role !== Role.ADMIN)
      throw new ForbiddenException('You are not admin');

    return true;
  }
}