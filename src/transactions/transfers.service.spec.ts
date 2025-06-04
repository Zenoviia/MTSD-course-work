import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { AccountsService } from '../accounts/accounts.service';
import { CurrencyConverterService } from '../currency-converter/currency-converter.service';
import { SentTransactionsService } from '../sent-transactions/sent-transactions.service';
import { ReceivedTransactionsService } from '../received-transactions/received-transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { TransferException } from '../exceptions/transfers/transfers';
import { Decimal } from '@prisma/client/runtime/library';

jest.mock('../utils/transactions/transactions', () => ({
  formatTransactions: jest.fn(() => 'formatted-result'),
}));

describe('TransfersService', () => {
  let service: TransfersService;

  const mockPrismaService = {
    $transaction: jest.fn(),
  };

  const mockAccountsService = {
    findOneById: jest.fn(),
    withdrawal: jest.fn(),
    replenishment: jest.fn(),
  };

  const mockConverterService = {
    convert: jest.fn(),
  };

  const mockSentTransactionsService = {
    getHistory: jest.fn(),
  };

  const mockReceivedTransactionsService = {
    getHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AccountsService, useValue: mockAccountsService },
        { provide: CurrencyConverterService, useValue: mockConverterService },
        { provide: SentTransactionsService, useValue: mockSentTransactionsService },
        { provide: ReceivedTransactionsService, useValue: mockReceivedTransactionsService },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const senderId = 1;
    const dto: TransferFundsDto = {
      receiverAccountId: 2,
      amount: '100',
    };

    it('should throw TransferException if sender and receiver account IDs are the same', async () => {
      await expect(service.create(2, senderId, { ...dto, receiverAccountId: 2 }))
        .rejects
        .toThrow(TransferException);
    });

    it('should perform transfer successfully with different accounts', async () => {
      const senderAccount = {
        id: 1,
        currency: 'USD',
        user_id: senderId,
      };
      const receiverAccount = {
        id: 2,
        currency: 'EUR',
        user_id: 3,
      };

      mockAccountsService.findOneById
        .mockImplementationOnce(() => senderAccount)
        .mockImplementationOnce(() => receiverAccount);

      mockConverterService.convert.mockResolvedValue(new Decimal(90));
      mockAccountsService.withdrawal.mockResolvedValue(undefined);
      mockAccountsService.replenishment.mockResolvedValue(undefined);
      mockPrismaService.$transaction.mockImplementation(async (callback: any) => {
        return await callback();
      });

      const result = await service.create(1, senderId, dto);

      expect(result).toEqual({ success: true });
      expect(mockAccountsService.findOneById).toHaveBeenCalledTimes(2);
      expect(mockConverterService.convert).toHaveBeenCalledWith(
        dto.amount,
        'USD',
        'EUR',
      );
      expect(mockAccountsService.withdrawal).toHaveBeenCalledWith(1, senderId, dto.amount);
      expect(mockAccountsService.replenishment).toHaveBeenCalledWith(2, 3, new Decimal(90));
    });
  });

  describe('getAccount', () => {
    it('should return account by id', async () => {
      const mockAccount = { id: 1, currency: 'USD' };
      mockAccountsService.findOneById.mockResolvedValue(mockAccount);
      const result = await service.getAccount(1);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('getHistory', () => {
    it('should return formatted history from sent and received transactions', async () => {
      const userId = 10;
      const sent = [{ id: 1 }];
      const received = [{ id: 2 }];

      mockSentTransactionsService.getHistory.mockResolvedValue(sent);
      mockReceivedTransactionsService.getHistory.mockResolvedValue(received);

      const result = await service.getHistory(userId);

      expect(mockSentTransactionsService.getHistory).toHaveBeenCalledWith(userId);
      expect(mockReceivedTransactionsService.getHistory).toHaveBeenCalledWith(userId);
      expect(result).toBe('formatted-result');
    });
  });
});
