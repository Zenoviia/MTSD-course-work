import { NotFoundException } from '@nestjs/common';

export class DepositNotFoundException extends NotFoundException {
  constructor() {
    super('Deposit not found');
  }
}