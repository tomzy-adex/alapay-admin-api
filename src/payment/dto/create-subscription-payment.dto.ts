import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionPaymentDto {
  @ApiProperty({
    description: 'HMO ID for the subscription',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsUUID()
  hmoId: string;

  @ApiProperty({
    description: 'Healthcare plan ID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsString()
  @IsUUID()
  planId: string;

  @ApiProperty({
    description: 'Payment option ID (monthly, yearly, etc.)',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsString()
  @IsUUID()
  paymentOptionId: string;

  @ApiProperty({
    description: 'Payment amount in kobo (multiply by 100)',
    example: 5000000 // NGN 50,000
  })
  @IsNumber()
  @Min(100) // Minimum 1 NGN
  amount: number;

  @ApiPropertyOptional({
    description: 'User ID (optional, will be taken from auth token)',
    example: '123e4567-e89b-12d3-a456-426614174003'
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Customer email for payment notification',
    example: 'customer@example.com'
  })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+2348012345678'
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Customer name',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  customerName?: string;
} 