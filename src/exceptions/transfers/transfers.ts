import { BadRequestException } from '@nestjs/common';

export class TransferException extends BadRequestException {
  constructor() {
    super('Unable to transfer money to the same account');
  }
}