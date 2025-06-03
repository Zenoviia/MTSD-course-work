import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { DepositsService } from 'src/deposits/deposits.service';

@Injectable()
export class DepositOwnerGuard implements CanActivate {
  constructor(private readonly depositsService: DepositsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    const deposit = await this.depositsService.findOneById(+params.depositId);

    const isOwner = deposit.user_id === user.user_id;
    if (!isOwner) throw new ForbiddenException('You are not owner');

    return true;
  }
}