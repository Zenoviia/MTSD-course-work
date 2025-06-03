import { Currency } from "@prisma/client";

export interface ILogReceivedTransaction {
  receiverId: number;
  receiverAccountId: number;
  amount: string;
  currency: Currency;
}