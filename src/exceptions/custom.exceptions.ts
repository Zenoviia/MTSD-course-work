import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}

export class QuestNotFoundException extends NotFoundException {
  constructor() {
    super('Quest not found');
  }
}

export class ProgressNotFoundException extends NotFoundException {
  constructor() {
    super('Progress record not found. Start quest first.');
  }
}

export class UserOwnerException extends ForbiddenException {
  constructor() {
    super('You can only delete your own account');
  }
}

export class TokenException extends NotFoundException {
  constructor() {
    super('Invalid or expired token');
  }
}

export class EmailConfirmException extends NotFoundException {
  constructor() {
    super('User email is not confirm');
  }
}

export class EnvException extends Error {
  constructor() {
    super('APP_PORT is not defined in environment variables');
  }
}

export class UserCreateException extends InternalServerErrorException {
  constructor() {
    super('Couldn`t create user');
  }
}

export class AccountNotFoundException extends NotFoundException {
  constructor() {
    super('Account not found');
  }
}

export class AccountBalanceException extends ForbiddenException {
  constructor() {
    super('You cannot close an account with a non-zero balance ');
  }
}