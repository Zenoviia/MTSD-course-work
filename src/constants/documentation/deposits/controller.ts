import { Role } from '@prisma/client';

export const DEPOSITS_API_DOCS = {
  createDeposit: {
    summary: 'Create a deposit',
    status: 201,
    description: 'Creates a deposit for the specified account',
    authRequired: true,
    role: Role.USER,
  },
  getFinalAmount: {
    summary: 'Get final deposit amount',
    status: 200,
    description: 'Returns the final deposit amount including interest',
    authRequired: true,
    role: Role.USER,
  },
  changeDepositProfit: {
    summary: 'Change deposit profit',
    status: 200,
    description: 'Updates the deposit profit percentage',
    authRequired: true,
    role: Role.ADMIN,
  },
};