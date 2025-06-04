export const API_DOCS = {
  register: {
    summary: 'Register a new user',
    status: 201,
    description: 'User registered successfully',
  },
  confirmEmail: {
    summary: 'Confirm email address',
    status: 200,
    description: 'Email successfully confirmed',
  },
  getAllUsers: {
    summary: 'Get all users',
    status: 200,
    description: 'Returns a list of all users',
  },
  getUserDetails: {
    summary: 'Get user details by ID',
    status: 200,
    description: 'Returns detailed user information',
  },
  blockUser: {
    summary: 'Block user',
    status: 200,
    description: 'User status updated',
  },
};