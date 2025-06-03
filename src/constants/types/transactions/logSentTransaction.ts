import { Currency } from '@prisma/client';

export interface ILogSentTransaction {
  senderId: number;
  senderAccountId: number;
  amount: string;
  currency: Currency;
}