export const AUTH_API_DOCS = {
  login: {
    summary: 'User login',
    status: 200,
    description:
      'Authenticates the user using local strategy and returns a JWT token',
    authRequired: false,
  },
  googleAuth: {
    summary: 'Google authentication',
    status: 200,
    description: 'Redirects the user to Google OAuth for authentication',
    authRequired: false,
  },
  googleAuthCallback: {
    summary: 'Google authentication callback',
    status: 200,
    description: 'Handles Google OAuth callback and returns a JWT token',
    authRequired: false,
  },
};