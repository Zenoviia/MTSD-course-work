import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import {
  UserNotFoundException,
  UserForbiddenException,
  BlockUserException,
  EmailConfirmException,
} from '../exceptions/users/users';
import { TokenException } from '../exceptions/token/token';
import { EMAIL } from '../constants/enums/email/email';
import * as bcrypt from 'bcryptjs';
const mockUser = {
  user_id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password: 'hashed-password',
  is_blocked: false,
  is_email_confirm: true,
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let jwt: JwtService;
  let email: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
            verify: jest.fn().mockReturnValue({ user_id: 1 }),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendConfirmationEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    email = module.get<EmailService>(EmailService);
  });

  describe('create', () => {
    it('should create user and send email', async () => {
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(
        'hashed-password',
      );
      prisma.user.findFirst = jest.fn().mockResolvedValue(null);
      prisma.user.create = jest.fn().mockResolvedValue(mockUser);

      jest.mock('nodemailer', () => ({
        createTransport: jest.fn().mockReturnValue({
          sendMail: jest.fn().mockResolvedValue({}),
        }),
      }));
      const result = await service.create({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual({ message: 'Logged in successfully' });
      expect(email.sendConfirmationEmail).toHaveBeenCalledWith(
        'test@example.com',
        'fake-jwt-token',
      );
    });

    it('should throw if user exists', async () => {
      prisma.user.findFirst = jest.fn().mockResolvedValue(mockUser);
      await expect(
        service.create({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        }),
      ).rejects.toThrow(UserForbiddenException);
    });

    it('should throw if user is blocked', async () => {
      prisma.user.findFirst = jest.fn().mockResolvedValue(null);
      prisma.user.create = jest
        .fn()
        .mockResolvedValue({ ...mockUser, is_blocked: true });
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(
        'hashed-password',
      );
      await expect(
        service.create({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        }),
      ).rejects.toThrow(BlockUserException);
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest
        .fn()
        .mockResolvedValue({ ...mockUser, is_email_confirm: true });

      const result = await service.confirmEmail('valid-token');
      expect(result).toEqual(EMAIL.CONFIRM_SUCCESS);
    });

    it('should throw on invalid token', async () => {
      jwt.verify = jest.fn(() => {
        throw new Error('Invalid');
      });

      await expect(service.confirmEmail('bad-token')).rejects.toThrow(
        TokenException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return user', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      const result = await service.findOneById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw if not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      await expect(service.findOneById(1)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw if blocked', async () => {
      prisma.user.findUnique = jest
        .fn()
        .mockResolvedValue({ ...mockUser, is_blocked: true });
      await expect(service.findOneById(1)).rejects.toThrow(BlockUserException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return user', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw if not confirmed', async () => {
      prisma.user.findUnique = jest
        .fn()
        .mockResolvedValue({ ...mockUser, is_email_confirm: false });
      await expect(service.findOneByEmail('test@example.com')).rejects.toThrow(
        EmailConfirmException,
      );
    });
  });

  describe('createByGoogle', () => {
    it('should create if not exists', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue({ message: 'Logged in successfully' });

      const result = await service.createByGoogle({
        email: 'test@example.com',
        username: 'testuser',
        password: 'google-password',
      });

      expect(result).toEqual({ message: 'Logged in successfully' });
      expect(createSpy).toHaveBeenCalled();
    });

    it('should return existing if exists', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      const result = await service.createByGoogle({
        email: 'test@example.com',
        username: 'testuser',
        password: 'google-password',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest
        .fn()
        .mockResolvedValue({ ...mockUser, username: 'new' });
      const result = await service.update(1, {
        username: 'new',
        is_blocked: false,
      });
      expect(result).toEqual('User 1 update successfully');
    });
  });

  describe('findOverdue', () => {
    it('should return overdue users', async () => {
      prisma.user.findMany = jest.fn().mockResolvedValue([mockUser]);
      const result = await service.findOverdue();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('removeOverdue', () => {
    it('should delete user', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.delete = jest.fn().mockResolvedValue(mockUser);
      const result = await service.removeOverdue(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      prisma.user.findMany = jest.fn().mockResolvedValue([mockUser]);
      const result = await service.getAllUsers();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findFullInfoById', () => {
    it('should return user with relations', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue({
        ...mockUser,
        accounts: [],
        deposits: [],
        transactions: [],
        received_transactions: [],
      });
      const result = await service.findFullInfoById(1);
      expect(result).toEqual(
        expect.objectContaining({
          accounts: [],
          deposits: [],
          transactions: [],
          received_transactions: [],
        }),
      );
    });
  });
});
