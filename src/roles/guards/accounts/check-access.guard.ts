import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly accountService: AccountsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    const account = await this.accountService.findOneById(+params.id);
    const isAccountOwner = account.user_id === user.user_id;
    if (!isAccountOwner) throw new ForbiddenException('You are not owner');

    return true;
  }
}