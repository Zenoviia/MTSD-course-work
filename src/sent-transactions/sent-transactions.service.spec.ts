import { Test, TestingModule } from '@nestjs/testing';
import { SentTransactionsService } from './sent-transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { Currency } from '@prisma/client';

const prismaMock = {
  sentTransaction: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('SentTransactionsService', () => {
  let sentTransactionsService: SentTransactionsService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        SentTransactionsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    sentTransactionsService = module.get<SentTransactionsService>(
      SentTransactionsService,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('create', () => {
    it('should create and return a sent transaction', async () => {
      const transaction = {
        senderId: 1,
        senderAccountId: 2,
        amount: '1000',
        currency: Currency.USD,
      };

      const createdTransaction = {
        id: 1,
        sender_id: transaction.senderId,
        sender_account_id: transaction.senderAccountId,
        amount: transaction.amount,
        currency: transaction.currency,
        created_at: new Date(),
      };

      prismaMock.sentTransaction.create.mockResolvedValue(createdTransaction);

      const result = await sentTransactionsService.create(transaction);
      expect(result).toEqual(createdTransaction);
      expect(prismaMock.sentTransaction.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.sentTransaction.create).toHaveBeenCalledWith({
        data: {
          sender_id: transaction.senderId,
          sender_account_id: transaction.senderAccountId,
          amount: transaction.amount,
          currency: transaction.currency,
        },
      });
    });
  });

  describe('getHistory', () => {
    it('should return transaction history ordered by created_at DESC', async () => {
      const id = 1;
      const transactions = [
        {
          id: 2,
          sender_id: id,
          amount: '500',
          currency: Currency.EUR,
          created_at: new Date('2024-02-20T12:00:00Z'),
        },
        {
          id: 1,
          sender_id: id,
          amount: '1000',
          currency: Currency.USD,
          created_at: new Date('2024-02-19T12:00:00Z'),
        },
      ];

      prismaMock.sentTransaction.findMany.mockResolvedValue(transactions);

      const result = await sentTransactionsService.getHistory(id);
      expect(result).toEqual(transactions);
      expect(prismaMock.sentTransaction.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.sentTransaction.findMany).toHaveBeenCalledWith({
        where: { sender_id: id },
        orderBy: { created_at: 'desc' },
      });
    });

    it('should return an empty array if no transactions are found', async () => {
      const id = 2;
      prismaMock.sentTransaction.findMany.mockResolvedValue([]);

      const result = await sentTransactionsService.getHistory(id);
      expect(result).toEqual([]);
      expect(prismaMock.sentTransaction.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.sentTransaction.findMany).toHaveBeenCalledWith({
        where: { sender_id: id },
        orderBy: { created_at: 'desc' },
      });
    });
  });
});