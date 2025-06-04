export const USER_PROPERTIES = {
  username: {
    example: 'john_doe',
    description: 'Username',
  },
  email: {
    example: 'user@example.com',
    description: 'User email',
  },
  password: {
    example: 'strongPass123',
    description: 'User password',
    minLength: 6,
  },
  is_blocked: {
    example: true,
    description: 'Block status',
    required: false,
  },
};