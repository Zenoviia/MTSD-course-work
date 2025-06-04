import { Role } from '@prisma/client';

export const TRANSFERS_API_DOCS = {
  create: {
    summary: 'Transfer funds between accounts',
    status: 201,
    description: 'Funds transferred successfully',
    authRequired: true,
  },
  transactionsHistory: {
    summary: 'Get user transaction history',
    status: 200,
    description: 'Returns transaction history',
    authRequired: true,
  },
  getUserHistory: {
    summary: 'Get transaction history of a specific user',
    status: 200,
    description: 'Returns user transaction history',
    authRequired: true,
    role: Role.ADMIN,
  },
};