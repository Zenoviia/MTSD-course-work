import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}

export class BlockUserException extends ForbiddenException {
  constructor() {
    super('Your account blocked');
  }
}

export class UserForbiddenException extends ForbiddenException {
  constructor() {
    super('User with this email or username already exists');
  }
}

export class EmailConfirmException extends NotFoundException {
  constructor() {
    super('User email is not confirm');
  }
}