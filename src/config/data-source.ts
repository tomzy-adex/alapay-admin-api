import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '.';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { Hmo } from '../hmo/entities/hmo.entity';
import { Claim } from '../claim/entities/claim.entity';
import { Notification } from '../notification/entities/notification.entity';
import { Payment } from '../payment/entities/payment.entity';
import { HealthcarePlan } from '../hmo/entities/healthcare-plan.entity';
import { Hospital } from '../hmo/entities/hospital.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { AuditLog } from '../audit-log/entities/audit-log.entity';
import { AccountTier } from '../hmo/entities/account-tier.entity';
import { PaymentOption } from '../payment/entities/payment-option.entity';
import { PlanSubscription } from '../hmo/entities/plan-subscription.entity';
import { Dependent } from '../hmo/entities/dependent.entity';
import { PreAuthRequest } from '../hmo/entities/pre-auth-request.entity';
import { Transaction } from '../payment/entities/transaction.entity';
import { ClaimPayment } from '../payment/entities/claim-payment.entity';
import { ProviderClaim } from '../claim/entities/provider-claim.entity';
import { Note } from '../claim/entities/note.entity';
import { HospitalInfo } from '../hmo/entities/hospital-info.entity';
import { ProviderEnrollment } from '../hmo/entities/provider-enrollment.entity';
import { ProviderRating } from '../hmo/entities/provider-rating.entity';
import { ProviderService } from '../hmo/entities/provider-service.entity';
import { OrganizationPlan } from '../organization/entities/organization-plan.entity';
import { OrganizationRenewal } from '../organization/entities/organization-renewal.entity';
import { Organization } from '../organization/entities/organization.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: config.db.url,
  migrations: ['dist/db/migrations/*.js'],
  ssl: config.env === 'development' ? false : { rejectUnauthorized: false },
  entities: [
    Role,
    User,
    Hmo,
    AccountTier,
    Claim,
    ClaimPayment,
    Notification,
    Payment,
    PaymentOption,
    PlanSubscription,
    HealthcarePlan,
    Hospital,
    Wallet,
    AuditLog,
    Dependent,
    PreAuthRequest,
    Transaction,
    ProviderClaim,
    HospitalInfo,
    Note,
    ProviderEnrollment,
    ProviderRating,
    ProviderService,
    Organization,
    OrganizationPlan,
    OrganizationRenewal,
  ],
  subscribers: [],
  logging: false,
};

export const dataSource = new DataSource(typeOrmConfig);
