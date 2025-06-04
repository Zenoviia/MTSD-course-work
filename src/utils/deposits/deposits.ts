import { Decimal } from '@prisma/client/runtime/library';
import { DEPOSITS } from 'src/constants/enums/deposits/deposits';

export function calculateCompoundInterest(
  amount: string,
  interestRate: number,
  startDate: Date,
  endDate: Date,
) {
  const years =
    (endDate.getTime() - startDate.getTime()) / DEPOSITS.MILLISECONDS_IN_YEAR;

  return new Decimal(amount).mul(
    new Decimal(1).add(new Decimal(interestRate).div(100)).pow(years),
  );
}