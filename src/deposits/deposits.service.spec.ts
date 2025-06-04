import { DepositsService } from './deposits.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { DepositNotFoundException } from '../exceptions/deposits/deposits';
import { calculateCompoundInterest } from '../utils/deposits/deposits';

jest.mock('../utils/deposits/deposits');

describe('DepositsService', () => {
  let service: DepositsService;
  let prisma: PrismaService;
  let accountsService: AccountsService;

  beforeEach(() => {
    prisma = {
      deposit: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    } as any;

    accountsService = {
      withdrawal: jest.fn(),
    } as any;

    service = new DepositsService(prisma, accountsService);
  });

  describe('create', () => {
    it('should withdraw money and create deposit', async () => {
      const dto = {
        amount: '100',
        interest_rate: 5,
        start_date: new Date(),
        end_date: new Date(),
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
        return await cb();
      });

      (prisma.deposit.create as jest.Mock).mockResolvedValue({});

      const result = await service.create(1, 2, dto as any);

      expect(accountsService.withdrawal).toHaveBeenCalledWith(2, 1, '100');
      expect(prisma.deposit.create).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });

  describe('calculateFinalAmount', () => {
    it('should return calculated final amount', async () => {
      const mockDeposit = {
        amount: '1000',
        interest_rate: 5,
        start_date: new Date('2020-01-01'),
        end_date: new Date('2025-01-01'),
      };

      const mockAmount = '1276.28';

      jest
        .spyOn(service, 'findOneById')
        .mockResolvedValue(mockDeposit as any);
      (calculateCompoundInterest as jest.Mock).mockReturnValue(mockAmount);

      const result = await service.calculateFinalAmount(1);
      expect(result).toEqual({ finalAmount: mockAmount });
    });
  });

  describe('findOneById', () => {
    it('should return deposit if found', async () => {
      const mockDeposit = { deposit_id: 1 };
      (prisma.deposit.findUnique as jest.Mock).mockResolvedValue(mockDeposit);

      const result = await service.findOneById(1);
      expect(result).toBe(mockDeposit);
    });

    it('should throw if deposit not found', async () => {
      (prisma.deposit.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOneById(1)).rejects.toThrow(
        DepositNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update deposit after finding it', async () => {
      (prisma.deposit.findUnique as jest.Mock).mockResolvedValue({ deposit_id: 1 });
      (prisma.deposit.update as jest.Mock).mockResolvedValue({});

      const result = await service.update(1, { amount: '2000' } as any);
      expect(prisma.deposit.update).toHaveBeenCalledWith({
        where: { deposit_id: 1 },
        data: { amount: '2000' },
      });
      expect(result).toBe('Deposit 1 update successfully');
    });
  });
});
