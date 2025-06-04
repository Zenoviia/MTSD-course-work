// src/currency-converter/currency-converter.service.spec.ts

import { CurrencyConverterService } from './currency-converter.service';
import { BadRequestException } from '@nestjs/common';

global.fetch = jest.fn(); // мок глобального fetch

describe('CurrencyConverterService', () => {
  let service: CurrencyConverterService;

  beforeEach(() => {
    service = new CurrencyConverterService();
    jest.clearAllMocks();
  });

  it('should return the same amount if from and to currencies are equal', async () => {
    const amount = '100';
    const result = await service.convert(amount, 'USD', 'USD');
    expect(result).toBe(amount);
  });

  it('should convert currency when API responds correctly', async () => {
    const mockRates = { UAH: 40 };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ rates: mockRates }),
    });

    const result = await service.convert('2', 'USD', 'UAH');
    expect(result).toBe('80'); // 2 * 40 = 80
  });

  it('should throw error when API does not respond ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    await expect(service.convert('10', 'USD', 'UAH')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw error when target currency is not in rates', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { EUR: 0.9 } }), // no UAH
    });

    await expect(service.convert('10', 'USD', 'UAH')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw error if fetch fails completely', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(service.convert('10', 'USD', 'UAH')).rejects.toThrow(
      BadRequestException,
    );
  });
});
