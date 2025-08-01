import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/notification/repositories/notification.repository';
import { RoleRepository } from 'src/role/repositories/role.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { HealthcarePlanRepository } from 'src/hmo/repositories/healthcare-plan.repository';
import { HospitalRepository } from 'src/hmo/repositories/hospital.repository';
import { PlanSubscriptionRepository } from 'src/hmo/repositories/plan-subscription.repository';
import { PaymentOptionRepository } from 'src/payment/repositories/payment-option.repository';
import { PaymentRepository } from 'src/payment/repositories/payment.repository';
import { DependentRepository } from 'src/hmo/repositories/dependent.repository';
import { PreAuthRequestRepository } from 'src/hmo/repositories/pre-auth-request.repository';
import { TransactionRepository } from 'src/payment/repositories/transaction.repository';
import { ClaimRepository } from 'src/claim/repositories/claim.repository';
import { WalletRepository } from 'src/wallet/repositories/wallet.repository';
import { NoteRepository } from 'src/claim/repositories/note.repository';
import { HmoRepository } from 'src/hmo/repositories/hmo.repository';
import { AccountTierRepository } from 'src/hmo/repositories/account-tier.repository';
import { ProviderClaimRepository } from 'src/claim/repositories/provider-claim.repository';
import { HospitalInfoRepository } from 'src/hmo/repositories/hospital-info.repository';
import { ClaimPaymentRepository } from 'src/payment/repositories/claim-payment.repository';

@Injectable()
export class DynamicRepositoryService {
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly planSubscriptionRepository: PlanSubscriptionRepository,
    private readonly healthcarePlanRepository: HealthcarePlanRepository,
    private readonly hospitalRepository: HospitalRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentOptionRepository: PaymentOptionRepository,
    private readonly dependentRepository: DependentRepository,
    private readonly preAuthRequestRepository: PreAuthRequestRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly claimRepository: ClaimRepository,
    private readonly walletRepository: WalletRepository,
    private readonly noteRepository: NoteRepository,
    private readonly hmoRepository: HmoRepository,
    private readonly providerClaimRepository: ProviderClaimRepository,
    private readonly hospitalInfoRepository: HospitalInfoRepository,
    private readonly claimPaymentRepository: ClaimPaymentRepository,
    private readonly accountTierRepository: AccountTierRepository,
  ) {}

  async getRepository(entityName: string) {
    const repositories = {
      User: this.userRepository,
      AuditLog: this.auditLogRepository,
      Notification: this.notificationRepository,
      Role: this.roleRepository,
      PlanSubscription: this.planSubscriptionRepository,
      HealthcarePlan: this.healthcarePlanRepository,
      Hospital: this.hospitalRepository,
      Payment: this.paymentRepository,
      PaymentOption: this.paymentOptionRepository,
      Dependent: this.dependentRepository,
      PreAuthRequest: this.preAuthRequestRepository,
      Transaction: this.transactionRepository,
      Claim: this.claimRepository,
      Wallet: this.walletRepository,
      Note: this.noteRepository,
      Hmo: this.hmoRepository,
      ProviderClaim: this.providerClaimRepository,
      HospitalInfo: this.hospitalInfoRepository,
      ClaimPayment: this.claimPaymentRepository,
      AccountTier: this.accountTierRepository,
    };

    return repositories[entityName];
  }
}
