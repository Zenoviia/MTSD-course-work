import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AccountOwnerGuard implements CanActivate {
  constructor(private readonly accountService: AccountsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    const account = await this.accountService.findOneById(+params.accountId);

    const isOwner = account.user_id === user.user_id;
    if (!isOwner) throw new ForbiddenException('You are not owner');

    return true;
  }
}