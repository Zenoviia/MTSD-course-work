import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyConverterService } from '../currency-converter/currency-converter.service';
import { SentTransactionsService } from '../sent-transactions/sent-transactions.service';
import { ReceivedTransactionsService } from '../received-transactions/received-transactions.service';
import {
  AccountBalanceException,
  AccountNotFoundException,
} from '../exceptions/accounts/accounts';
import { Decimal } from '@prisma/client/runtime/library';
// import { Currency } from './accounts.controller';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
}

describe('AccountsService', () => {
  let service: AccountsService;
  let prisma: PrismaService;

  const mockPrisma = {
    account: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockConverterService = {
    convert: jest.fn(),
  };

  const mockSentTransactionsService = {
    create: jest.fn(),
  };

  const mockReceivedTransactionsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CurrencyConverterService, useValue: mockConverterService },
        {
          provide: SentTransactionsService,
          useValue: mockSentTransactionsService,
        },
        {
          provide: ReceivedTransactionsService,
          useValue: mockReceivedTransactionsService,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should create an account', async () => {
    const dto = { currency: Currency.USD }; // Use enum, not string
    const result = { id: 1, currency: Currency.USD };

    mockPrisma.account.create.mockResolvedValue(result);
    const created = await service.create(1, dto);

    expect(created).toEqual(result);
    expect(mockPrisma.account.create).toHaveBeenCalledWith({
      data: { user_id: 1, currency: Currency.USD },
    });
  });

  it('should throw AccountNotFoundException when account not found', async () => {
    mockPrisma.account.findUnique.mockResolvedValue(null);

    await expect(service.findOneById(123)).rejects.toThrow(
      AccountNotFoundException,
    );
  });

  it('should delete account with non-zero balance', async () => {
    const account = { account_id: 1, balance: 10 };
    mockPrisma.account.findUnique.mockResolvedValue(account);
    mockPrisma.account.delete.mockResolvedValue(account);

    const deleted = await service.close(1);
    expect(deleted).toEqual(account);
  });

  it('should throw AccountBalanceException when closing account with zero balance', async () => {
    const account = { account_id: 1, balance: 0 };
    mockPrisma.account.findUnique.mockResolvedValue(account);

    await expect(service.close(1)).rejects.toThrow(AccountBalanceException);
  });

  it('should replenish an account and create received transaction', async () => {
    const account = { account_id: 1, currency: 'USD', balance: 100 };
    mockPrisma.account.findUnique.mockResolvedValue(account);
    mockPrisma.account.update.mockResolvedValue(account);

    const result = await service.replenishment(1, 2, '50');

    expect(result).toEqual(account);
    expect(mockPrisma.account.update).toHaveBeenCalledWith({
      where: { account_id: 1 },
      data: { balance: { increment: 50 } },
    });
    expect(mockReceivedTransactionsService.create).toHaveBeenCalled();
  });

  it('should withdraw from account and create sent transaction', async () => {
    const account = { account_id: 1, currency: 'USD', balance: 100 };
    const updatedAccount = { ...account, balance: 50 };

    mockPrisma.account.findUnique.mockResolvedValue(account);
    mockPrisma.account.update.mockResolvedValue(updatedAccount);

    const result = await service.withdrawal(1, 2, '50');

    expect(result).toEqual(updatedAccount);
    expect(mockSentTransactionsService.create).toHaveBeenCalled();
  });

  it('should throw AccountBalanceException if not enough balance for withdrawal', async () => {
    const account = { account_id: 1, currency: 'USD', balance: 10 };

    mockPrisma.account.findUnique.mockResolvedValue(account);

    await expect(service.withdrawal(1, 2, '50')).rejects.toThrow(
      AccountBalanceException,
    );
  });

  it('should return converted balance', async () => {
    const account = { account_id: 1, currency: 'USD', balance: 100 };
    mockPrisma.account.findUnique.mockResolvedValue(account);
    mockConverterService.convert.mockResolvedValue('2700');

    const result = await service.getBalance(1, { currency: Currency.UAH });

    expect(result).toEqual({ balance: '2700', currency: 'UAH' });
  });
});
