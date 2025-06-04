import { Role } from '@prisma/client';

export const ACCOUNTS_API_DOCS = {
  createAccount: {
    summary: 'Create a new account',
    status: 201,
    description: 'Creates a new user account with the specified currency',
    authRequired: true,
    role: Role.USER,
  },
  closeAccount: {
    summary: 'Close an account',
    status: 200,
    description: 'Closes the specified user account',
    authRequired: true,
    role: Role.USER,
  },
  replenishment: {
    summary: 'Replenish account balance',
    status: 200,
    description: 'Adds funds to the user account balance',
    authRequired: true,
    role: Role.USER,
  },
  withdrawal: {
    summary: 'Withdraw funds from account',
    status: 200,
    description: 'Withdraws funds from the user account balance',
    authRequired: true,
    role: Role.USER,
  },
  getBalance: {
    summary: 'Get account balance',
    status: 200,
    description: 'Returns the current balance of the specified account',
    authRequired: true,
    role: Role.USER,
  },
};