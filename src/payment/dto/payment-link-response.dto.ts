import { ApiProperty } from '@nestjs/swagger';

export class PaymentLinkResponseDto {
  @ApiProperty({
    description: 'Payment link for Interswitch payment gateway',
    example: 'https://sandbox.interswitchng.com/pay?ref=123456789'
  })
  paymentLink: string;

  @ApiProperty({
    description: 'Unique transaction reference',
    example: 'TXN_123456789_20240101'
  })
  transactionReference: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'PENDING',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']
  })
  status: string;

  @ApiProperty({
    description: 'Payment expiry date',
    example: '2024-01-02T00:00:00.000Z'
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Payment amount in kobo',
    example: 5000000
  })
  amount: number;

  @ApiProperty({
    description: 'Payment amount in NGN',
    example: '50,000.00'
  })
  amountInNaira: string;

  @ApiProperty({
    description: 'HMO name',
    example: 'Lagos State Health Management Agency'
  })
  hmoName: string;

  @ApiProperty({
    description: 'Plan name',
    example: 'Premium Family Plan'
  })
  planName: string;

  @ApiProperty({
    description: 'Payment option name',
    example: 'Monthly'
  })
  paymentOptionName: string;
}

export class PaymentVerificationDto {
  @ApiProperty({
    description: 'Transaction reference to verify',
    example: 'TXN_123456789_20240101'
  })
  transactionReference: string;
}

export class PaymentVerificationResponse {
  @ApiProperty({
    description: 'Transaction reference',
    example: 'TXN_123456789_20240101'
  })
  transactionReference: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'COMPLETED',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']
  })
  status: string;

  @ApiProperty({
    description: 'Payment amount in kobo',
    example: 5000000
  })
  amount: number;

  @ApiProperty({
    description: 'Payment date',
    example: '2024-01-01T12:00:00.000Z'
  })
  paymentDate: Date;

  @ApiProperty({
    description: 'Payment method used',
    example: 'CARD',
    enum: ['CARD', 'WALLET', 'NIP_TRANSFER']
  })
  paymentMethod: string;

  @ApiProperty({
    description: 'Whether subscription is activated',
    example: true
  })
  subscriptionActivated: boolean;
} 