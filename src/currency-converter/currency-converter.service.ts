import { Injectable, BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { CONVERTER } from 'src/constants/enums/currency-converter/currency-converter';

@Injectable()
export class CurrencyConverterService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = CONVERTER.API_URL;
    this.apiKey = String(process.env.CURRENCY_API_KEY);
  }

  async convert(amount: string, from: string, to: string) {
    if (from === to) return amount;

    try {
      const response = await fetch(
        `${this.apiUrl}${from}?apikey=${this.apiKey}`,
      );

      if (!response.ok) {
        throw new BadRequestException('Error fetching exchange rates from API');
      }

      const data = await response.json();
      const rates = data.rates;

      if (!rates[to]) {
        throw new BadRequestException(`Unsupported currency: ${to}`);
      }

      return new Decimal(amount).mul(rates[to]).toString();
    } catch (error) {
      throw new BadRequestException('Error converting currency');
    }
  }
}