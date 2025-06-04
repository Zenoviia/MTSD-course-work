export const DEPOSIT_PROPERTIES = {
  amount: {
    example: '1000.50',
    description:
      'Deposit amount, must be a positive number with up to two decimal places',
    message: 'Amount must be a positive number with up to two decimal places',
  },
  interestRate: {
    example: 5.5,
    description: 'Interest rate in percentage',
  },
  startDate: {
    example: '2025-01-01T00:00:00.000Z',
    description: 'Start date of the deposit',
  },
  endDate: {
    example: '2026-01-01T00:00:00.000Z',
    description: 'End date of the deposit',
  },
};