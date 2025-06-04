import { Test, TestingModule } from '@nestjs/testing';
import { ReceivedTransactionsService } from './received-transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { ILogReceivedTransaction } from '../constants/types/transactions/logReceivedTransaction';

describe('ReceivedTransactionsService', () => {
  let service: ReceivedTransactionsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    receivedTransaction: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceivedTransactionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReceivedTransactionsService>(ReceivedTransactionsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call prisma.receivedTransaction.create with correct data', async () => {
      const transaction: ILogReceivedTransaction = {
        receiverId: 1,
        receiverAccountId: 100,
        amount: '500.00',
        currency: 'USD',
      };

      const expectedResult = { id: 1, ...transaction };
      mockPrismaService.receivedTransaction.create.mockResolvedValue(expectedResult);

      const result = await service.create(transaction);

      expect(prisma.receivedTransaction.create).toHaveBeenCalledWith({
        data: {
          receiver_id: transaction.receiverId,
          receiver_account_id: transaction.receiverAccountId,
          amount: transaction.amount,
          currency: transaction.currency,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getHistory', () => {
    it('should return received transactions ordered by created_at desc', async () => {
      const receiverId = 1;
      const mockHistory = [
        {
          id: 1,
          receiver_id: 1,
          receiver_account_id: 100,
          amount: '100.00',
          currency: 'USD',
          created_at: new Date(),
        },
      ];
      mockPrismaService.receivedTransaction.findMany.mockResolvedValue(mockHistory);

      const result = await service.getHistory(receiverId);

      expect(prisma.receivedTransaction.findMany).toHaveBeenCalledWith({
        where: {
          receiver_id: receiverId,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      expect(result).toEqual(mockHistory);
    });
  });
});
