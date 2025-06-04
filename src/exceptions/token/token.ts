import { NotFoundException } from '@nestjs/common';

export class TokenException extends NotFoundException {
  constructor() {
    super('Invalid or expired token');
  }
}