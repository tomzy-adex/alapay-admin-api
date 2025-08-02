import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { InterswitchConfigService, InterswitchConfig } from '../../config/interswitch.config';
import { CreateSubscriptionPaymentDto } from '../dto/create-subscription-payment.dto';
import { PaymentLinkResponseDto, PaymentVerificationResponse } from '../dto/payment-link-response.dto';
import { PaymentRepository } from '../repositories/payment.repository';
import { HmoRepository } from '../../hmo/repositories/hmo.repository';
import { HealthcarePlanRepository } from '../../hmo/repositories/healthcare-plan.repository';
import { PaymentOptionRepository } from '../repositories/payment-option.repository';
import { PaymentMethod, ProcessStatus } from '../../utils/types';

@Injectable()
export class InterswitchPaymentService {
  private readonly logger = new Logger(InterswitchPaymentService.name);
  private readonly config: InterswitchConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly interswitchConfigService: InterswitchConfigService,
    private readonly paymentRepository: PaymentRepository,
    private readonly hmoRepository: HmoRepository,
    private readonly healthcarePlanRepository: HealthcarePlanRepository,
    private readonly paymentOptionRepository: PaymentOptionRepository,
  ) {
    this.config = this.interswitchConfigService.getConfig();
  }

  /**
   * Generate payment link for subscription payment
   */
  async generatePaymentLink(paymentData: CreateSubscriptionPaymentDto): Promise<PaymentLinkResponseDto> {
    try {
      // 1. Validate payment data
      await this.validatePaymentData(paymentData);

      // 2. Generate unique transaction reference
      const transactionReference = this.generateTransactionReference();

      // 3. Create payment record in database
      const payment = await this.createPaymentRecord(paymentData, transactionReference);

      // 4. Generate Interswitch payment link
      const paymentLink = await this.generateInterswitchLink(payment, transactionReference);

      // 5. Get additional details for response
      const hmo = await this.hmoRepository.findOne({ where: { id: paymentData.hmoId } });
      const plan = await this.healthcarePlanRepository.findOne({ where: { id: paymentData.planId } });
      const paymentOption = await this.paymentOptionRepository.findOne({ where: { id: paymentData.paymentOptionId } });

      return {
        paymentLink: paymentLink,
        transactionReference: transactionReference,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        amount: paymentData.amount,
        amountInNaira: this.formatAmountInNaira(paymentData.amount),
        hmoName: hmo?.name || 'Unknown HMO',
        planName: plan?.name || 'Unknown Plan',
        paymentOptionName: paymentOption?.name || 'Unknown Option',
      };
    } catch (error) {
      this.logger.error(`Error generating payment link: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to generate payment link: ${error.message}`);
    }
  }

  /**
   * Verify payment with Interswitch
   */
  async verifyPayment(transactionReference: string): Promise<PaymentVerificationResponse> {
    try {
      // 1. Get payment record
      const payment = await this.paymentRepository.findByTransactionReference(transactionReference);
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }

      // 2. Verify with Interswitch
      const verificationData = await this.verifyWithInterswitch(transactionReference);

      // 3. Update payment status
      await this.updatePaymentStatus(payment.id, verificationData.status);

      // 4. Activate subscription if payment is successful
      let subscriptionActivated = false;
      if (verificationData.status === 'COMPLETED') {
        await this.activateSubscription(payment.id);
        subscriptionActivated = true;
      }

      return {
        transactionReference: transactionReference,
        status: verificationData.status,
        amount: payment.amount,
        paymentDate: verificationData.paymentDate || new Date(),
        paymentMethod: verificationData.paymentMethod || 'UNKNOWN',
        subscriptionActivated: subscriptionActivated,
      };
    } catch (error) {
      this.logger.error(`Error verifying payment: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to verify payment: ${error.message}`);
    }
  }

  /**
   * Handle Interswitch webhook
   */
  async handlePaymentWebhook(webhookData: any, signature: string): Promise<void> {
    try {
      // 1. Verify webhook signature
      if (!this.verifyWebhookSignature(webhookData, signature)) {
        throw new BadRequestException('Invalid webhook signature');
      }

      // 2. Process webhook data
      const { transactionReference, status, paymentMethod } = webhookData;

      // 3. Update payment status
      const payment = await this.paymentRepository.findByTransactionReference(transactionReference);
      if (payment) {
        await this.updatePaymentStatus(payment.id, status);

        // 4. Activate subscription if payment is successful
        if (status === 'COMPLETED') {
          await this.activateSubscription(payment.id);
        }
      }

      this.logger.log(`Webhook processed successfully for transaction: ${transactionReference}`);
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private async validatePaymentData(paymentData: CreateSubscriptionPaymentDto): Promise<void> {
    // Validate HMO exists
    const hmo = await this.hmoRepository.findOne({ where: { id: paymentData.hmoId } });
    if (!hmo) {
      throw new BadRequestException('HMO not found');
    }

    // Validate plan exists
    const plan = await this.healthcarePlanRepository.findOne({ where: { id: paymentData.planId } });
    if (!plan) {
      throw new BadRequestException('Healthcare plan not found');
    }

    // Validate payment option exists
    const paymentOption = await this.paymentOptionRepository.findOne({ where: { id: paymentData.paymentOptionId } });
    if (!paymentOption) {
      throw new BadRequestException('Payment option not found');
    }

    // Validate amount
    if (paymentData.amount < 100) {
      throw new BadRequestException('Amount must be at least 1 NGN (100 kobo)');
    }
  }

  private generateTransactionReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `TXN_${timestamp}_${random}`.toUpperCase();
  }

  private async createPaymentRecord(
    paymentData: CreateSubscriptionPaymentDto,
    transactionReference: string,
  ): Promise<any> {
    const payment = {
      amount: paymentData.amount,
      paymentMethod: PaymentMethod.CARD, // Default for Interswitch
      status: ProcessStatus.PENDING,
      transactionReference: transactionReference,
      userId: paymentData.userId,
      hmoId: paymentData.hmoId,
      planId: paymentData.planId,
      paymentOptionId: paymentData.paymentOptionId,
      customerEmail: paymentData.customerEmail,
      customerPhone: paymentData.customerPhone,
      customerName: paymentData.customerName,
    };

    return await this.paymentRepository.createPayment(payment);
  }

  private async generateInterswitchLink(payment: any, transactionReference: string): Promise<string> {
    const payload = {
      merchantId: this.config.merchantId,
      merchantCode: this.config.merchantCode,
      terminalId: this.config.terminalId,
      amount: payment.amount.toString(),
      currency: this.config.currency,
      countryCode: this.config.countryCode,
      transactionReference: transactionReference,
      customerEmail: payment.customerEmail || '',
      customerName: payment.customerName || '',
      customerPhone: payment.customerPhone || '',
      returnUrl: `${this.configService.get('BASE_URL')}/api/v1/payment/callback`,
      cancelUrl: `${this.configService.get('BASE_URL')}/api/v1/payment/cancel`,
    };

    // Generate signature
    const signature = this.generateSignature(payload);

    // Make request to Interswitch
    const response = await axios.post(
      `${this.config.baseUrl}/api/payment/initiate`,
      {
        ...payload,
        signature: signature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`,
        },
      }
    );

    if (response.data.success) {
      return response.data.paymentUrl;
    } else {
      throw new BadRequestException('Failed to generate payment link from Interswitch');
    }
  }

  private generateSignature(payload: any): string {
    const dataString = Object.keys(payload)
      .sort()
      .map(key => `${key}=${payload[key]}`)
      .join('&');

    return CryptoJS.HmacSHA256(dataString, this.config.secretKey).toString();
  }

  private async verifyWithInterswitch(transactionReference: string): Promise<any> {
    const payload = {
      merchantId: this.config.merchantId,
      transactionReference: transactionReference,
    };

    const signature = this.generateSignature(payload);

    const response = await axios.post(
      `${this.config.baseUrl}/api/payment/verify`,
      {
        ...payload,
        signature: signature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`,
        },
      }
    );

    return response.data;
  }

  private verifyWebhookSignature(webhookData: any, signature: string): boolean {
    const expectedSignature = this.generateSignature(webhookData);
    return expectedSignature === signature;
  }

  private async updatePaymentStatus(paymentId: string, status: string): Promise<void> {
    await this.paymentRepository.updatePaymentStatus(paymentId, status);
  }

  private async activateSubscription(paymentId: string): Promise<void> {
    // This will be implemented when we create the subscription service
    this.logger.log(`Activating subscription for payment: ${paymentId}`);
  }

  private formatAmountInNaira(amountInKobo: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amountInKobo / 100);
  }
} 