import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Headers, 
  HttpCode, 
  HttpStatus,
  Query 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiHeader 
} from '@nestjs/swagger';
import { InterswitchPaymentService } from './services/interswitch-payment.service';
import { CreateSubscriptionPaymentDto } from './dto/create-subscription-payment.dto';
import { 
  PaymentLinkResponseDto, 
  PaymentVerificationDto, 
  PaymentVerificationResponse 
} from './dto/payment-link-response.dto';

@Controller('payment')
@ApiTags('Subscription Payments')
@ApiBearerAuth('JWT')
export class PaymentController {
  constructor(
    private readonly interswitchPaymentService: InterswitchPaymentService,
  ) {}

  @Post('subscription/generate-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Generate payment link for HMO subscription',
    description: 'Creates a payment link for users to pay for HMO subscriptions via Interswitch'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment link generated successfully',
    type: PaymentLinkResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid payment data' 
  })
  async generateSubscriptionPaymentLink(
    @Body() paymentData: CreateSubscriptionPaymentDto,
  ): Promise<PaymentLinkResponseDto> {
    // For testing, we'll use a default user ID
    if (!paymentData.userId) {
      paymentData.userId = 'test-user-id';
    }

    if (!paymentData.customerEmail) {
      paymentData.customerEmail = 'test@example.com';
    }

    if (!paymentData.customerName) {
      paymentData.customerName = 'Test User';
    }

    return await this.interswitchPaymentService.generatePaymentLink(paymentData);
  }

  @Post('subscription/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Verify subscription payment',
    description: 'Verifies a payment with Interswitch and activates subscription if successful'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment verified successfully',
    type: PaymentVerificationResponse 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Payment verification failed' 
  })
  async verifySubscriptionPayment(
    @Body() verificationData: PaymentVerificationDto,
  ): Promise<PaymentVerificationResponse> {
    return await this.interswitchPaymentService.verifyPayment(
      verificationData.transactionReference,
    );
  }

  @Post('webhook/interswitch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Interswitch payment webhook',
    description: 'Handles payment status updates from Interswitch'
  })
  @ApiHeader({
    name: 'x-interswitch-signature',
    description: 'Interswitch webhook signature for verification',
    required: true,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Webhook processed successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid webhook signature' 
  })
  async handleInterswitchWebhook(
    @Body() webhookData: any,
    @Headers('x-interswitch-signature') signature: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.interswitchPaymentService.handlePaymentWebhook(webhookData, signature);
    return { success: true, message: 'Webhook processed successfully' };
  }

  @Get('subscription/status/:transactionReference')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get subscription payment status',
    description: 'Retrieves the current status of a subscription payment'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment status retrieved successfully',
    type: PaymentVerificationResponse 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found' 
  })
  async getPaymentStatus(
    @Param('transactionReference') transactionReference: string,
  ): Promise<PaymentVerificationResponse> {
    return await this.interswitchPaymentService.verifyPayment(transactionReference);
  }

  @Get('subscription/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Payment callback URL',
    description: 'Handles successful payment redirects from Interswitch'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment callback processed' 
  })
  async handlePaymentCallback(
    @Query('transactionReference') transactionReference: string,
    @Query('status') status: string,
  ): Promise<{ success: boolean; message: string; redirectUrl: string }> {
    // Verify the payment
    const verificationResult = await this.interswitchPaymentService.verifyPayment(transactionReference);
    
    // Redirect to frontend with status
    const redirectUrl = `${process.env.FRONTEND_URL}/payment/result?status=${verificationResult.status}&reference=${transactionReference}`;
    
    return {
      success: true,
      message: 'Payment callback processed successfully',
      redirectUrl: redirectUrl,
    };
  }

  @Get('subscription/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Payment cancellation URL',
    description: 'Handles payment cancellation redirects from Interswitch'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment cancellation processed' 
  })
  async handlePaymentCancel(
    @Query('transactionReference') transactionReference: string,
  ): Promise<{ success: boolean; message: string; redirectUrl: string }> {
    // Redirect to frontend with cancellation status
    const redirectUrl = `${process.env.FRONTEND_URL}/payment/result?status=CANCELLED&reference=${transactionReference}`;
    
    return {
      success: true,
      message: 'Payment cancellation processed',
      redirectUrl: redirectUrl,
    };
  }
}
