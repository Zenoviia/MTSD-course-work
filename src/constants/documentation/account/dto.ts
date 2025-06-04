export const ACCOUNT_PROPERTIES = {
  currency: {
    example: 'USD',
    description: 'Account currency. Must be one of: USD, EUR, UAH, etc.',
    message: 'Currency must be one of: USD, EUR, UAH etc.',
  },
  amount: {
    example: '500.00',
    description:
      'Transaction amount, must be a positive number with up to two decimal places',
    message: 'Amount must be a positive number with up to two decimal places',
  },
};