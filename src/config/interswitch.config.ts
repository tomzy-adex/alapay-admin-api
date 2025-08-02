import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface InterswitchConfig {
  merchantId: string;
  merchantCode: string;
  terminalId: string;
  secretKey: string;
  environment: 'test' | 'live';
  currency: string;
  countryCode: string;
  baseUrl: string;
}

@Injectable()
export class InterswitchConfigService {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): InterswitchConfig {
    const environment = this.configService.get<string>('INTERSWITCH_ENVIRONMENT', 'test');
    
    return {
      merchantId: this.configService.get<string>('INTERSWITCH_MERCHANT_ID', ''),
      merchantCode: this.configService.get<string>('INTERSWITCH_MERCHANT_CODE', ''),
      terminalId: this.configService.get<string>('INTERSWITCH_TERMINAL_ID', ''),
      secretKey: this.configService.get<string>('INTERSWITCH_SECRET_KEY', ''),
      environment: environment as 'test' | 'live',
      currency: this.configService.get<string>('INTERSWITCH_CURRENCY', 'NGN'),
      countryCode: this.configService.get<string>('INTERSWITCH_COUNTRY_CODE', 'NG'),
      baseUrl: environment === 'live' 
        ? 'https://pay.interswitchng.com'
        : 'https://sandbox.interswitchng.com',
    };
  }

  isTestEnvironment(): boolean {
    return this.configService.get<string>('INTERSWITCH_ENVIRONMENT', 'test') === 'test';
  }
}

export const interswitchConfig = {
  // Default test values (replace with actual values in production)
  test: {
    merchantId: '2547916',
    merchantCode: 'MX149785',
    terminalId: '3F000012345',
    secretKey: 'abracadabra',
    baseUrl: 'https://sandbox.interswitchng.com',
  },
  live: {
    merchantId: process.env.INTERSWITCH_MERCHANT_ID || '',
    merchantCode: process.env.INTERSWITCH_MERCHANT_CODE || '',
    terminalId: process.env.INTERSWITCH_TERMINAL_ID || '',
    secretKey: process.env.INTERSWITCH_SECRET_KEY || '',
    baseUrl: 'https://pay.interswitchng.com',
  }
}; 