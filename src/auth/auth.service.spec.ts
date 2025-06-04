// src/auth/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailConfirmException } from '../exceptions/users/users';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    createByGoogle: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return signed JWT token', async () => {
      const user = { user_id: 1 };
      const token = await authService.login(user as any);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        user_id: 1,
        sub: 1,
      });
      expect(token).toBe('mocked-jwt-token');
    });
  });

  describe('validateUser', () => {
    it('should return user without password if password is correct', async () => {
      const user = {
        user_id: 1,
        email: 'test@example.com',
        password: '$2a$10$abcdabcdabcdabcdabcdab', // bcrypt hash
      };
      // симулюємо порівняння bcrypt вручну через compareSync
      jest.spyOn(require('bcryptjs'), 'compareSync').mockReturnValue(true);
      mockUsersService.findOneByEmail.mockResolvedValue(user);

      const result = await authService.validateUser('test@example.com', 'plaintext-password');

      expect(result).toEqual({
        user_id: 1,
        email: 'test@example.com',
      });
    });

    it('should return null if password is incorrect', async () => {
      const user = {
        user_id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
      };
      jest.spyOn(require('bcryptjs'), 'compareSync').mockReturnValue(false);
      mockUsersService.findOneByEmail.mockResolvedValue(user);

      const result = await authService.validateUser('test@example.com', 'wrong-password');
      expect(result).toBeNull();
    });
  });

  describe('validateGoogleUser', () => {
    it('should throw EmailConfirmException if email is not confirmed', async () => {
      const profile = {
        is_email_confirm: false,
      };

      await expect(authService.validateGoogleUser(profile as any)).rejects.toThrow(EmailConfirmException);
    });

    it('should call usersService.createByGoogle if email is confirmed', async () => {
      const profile = {
        is_email_confirm: true,
        email: 'googleuser@example.com',
      };
      mockUsersService.createByGoogle.mockResolvedValue({ user_id: 2 });

      const result = await authService.validateGoogleUser(profile as any);
      expect(mockUsersService.createByGoogle).toHaveBeenCalledWith(profile);
      expect(result).toEqual({ user_id: 2 });
    });
  });
});
