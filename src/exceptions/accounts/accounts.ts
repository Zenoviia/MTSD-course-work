import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class AccountNotFoundException extends NotFoundException {
  constructor() {
    super('Account not found');
  }
}
export class AccountBalanceException extends ForbiddenException {
  constructor() {
    super('You cannot close an account with a non-zero balance');
  }
}