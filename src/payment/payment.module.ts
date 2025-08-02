import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentOption } from './entities/payment-option.entity';
import { EmailService } from 'src/email/email.service';
import { HealthcarePlanRepository } from 'src/hmo/repositories/healthcare-plan.repository';
import { PlanSubscriptionRepository } from 'src/hmo/repositories/plan-subscription.repository';
import { NotificationRepository } from 'src/notification/repositories/notification.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { PaymentOptionRepository } from './repositories/payment-option.repository';
import { PaymentRepository } from './repositories/payment.repository';
import { DynamicRepositoryService } from 'src/audit-log/dynamic-repository.service';
import { AuditLogRepository } from 'src/audit-log/repositories/audit-log.repository';
import { RoleRepository } from 'src/role/repositories/role.repository';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { ClaimPaymentRepository } from './repositories/claim-payment.repository';
import { ClaimPayment } from './entities/claim-payment.entity';
import { InterswitchPaymentService } from './services/interswitch-payment.service';
import { InterswitchConfigService } from '../config/interswitch.config';
import { HmoRepository } from '../hmo/repositories/hmo.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      PaymentOption,
      Transaction,
      ClaimPayment,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    PaymentService,
    PaymentRepository,
    PaymentOptionRepository,
    HealthcarePlanRepository,
    PlanSubscriptionRepository,
    UserRepository,
    NotificationRepository,
    EmailService,
    DynamicRepositoryService,
    AuditLogRepository,
    RoleRepository,
    TransactionRepository,
    ClaimPaymentRepository,
    InterswitchPaymentService,
    InterswitchConfigService,
    HmoRepository,
  ],
  controllers: [PaymentController],
  exports: [
    PaymentService,
    PaymentRepository,
    PaymentOptionRepository,
    DynamicRepositoryService,
    TransactionRepository,
    ClaimPaymentRepository,
    InterswitchPaymentService,
    InterswitchConfigService,
  ],
})
export class PaymentModule {}
