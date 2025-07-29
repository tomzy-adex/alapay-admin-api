import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743943105956 implements MigrationInterface {
  name = 'Migration1743943105956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "message" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'unread', "userId" uuid, "hmoId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hospital_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "accountName" character varying(255) NOT NULL, "accountNumber" character varying(10) NOT NULL, "bankName" character varying(100) NOT NULL, "bankCode" character varying NOT NULL, CONSTRAINT "PK_b5ee4d366d82c44578cfa44ab8d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL DEFAULT 'Monthly', "duration" integer NOT NULL DEFAULT '30', "planId" uuid, CONSTRAINT "PK_ac63f00d5ea9fe8c30a24ccc314" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "amount" numeric(10,2) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'Pending', "reference" character varying, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_paymentmethod_enum" AS ENUM('card', 'wallet', 'nip-transfer')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "amount" numeric(10,2) NOT NULL, "paymentMethod" "public"."payments_paymentmethod_enum" NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'Pending', "dueDate" date, "receiptUrl" character varying, "userId" uuid, "paymentOptionId" uuid, "transactionId" uuid, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dependents_relationship_enum" AS ENUM('spouse', 'child', 'parent', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "dependents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "relationship" "public"."dependents_relationship_enum" NOT NULL, "enrolleeNo" character varying NOT NULL, "subscriptionId" uuid, CONSTRAINT "PK_9ecb9400bc31d2e3955aa944a9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plan_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'dormant', "enrolleeNo" character varying NOT NULL, "switchActivationDate" date, "queuedPlanId" uuid, "paymentId" uuid, "planId" uuid, "userId" uuid, CONSTRAINT "PK_fbecd15ea78b4de498d0b0b4b00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_auth_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "treatmentDetails" json NOT NULL, "providerInfo" json NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "subscriptionsId" uuid, CONSTRAINT "PK_9296134e369140873d80500f2b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."health_provider_claim_payments_status_enum" AS ENUM('Paid', 'Partially Paid', 'Unpaid')`,
    );
    await queryRunner.query(
      `CREATE TABLE "health_provider_claim_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "amountExpected" numeric(10,2) NOT NULL, "amountPaid" numeric(10,2) NOT NULL, "paymentDate" date NOT NULL, "hmoName" character varying(100) NOT NULL, "status" "public"."health_provider_claim_payments_status_enum" NOT NULL, "isFlagged" boolean, "flagReason" text, "flaggedBy" text, "createdBy" text, CONSTRAINT "PK_765d2b763793424a6321e14a20e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "note" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "providerClaimId" uuid, "userId" uuid, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "health_provider_claims" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "enrolleeNo" character varying(255) NOT NULL, "claimReference" character varying(255) NOT NULL, "serviceBreakdown" json, "documents" json, "diagnosis" text, "testResults" json, "dischargeSummary" text, "status" character varying NOT NULL DEFAULT 'Pending', "authorizationCode" text, "hmoId" uuid, "hospitalId" uuid, CONSTRAINT "PK_899ee84feee2026abe8e4068ca6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hospitals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "address" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "emergencyServiceProvider" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_02738c80d71453bc3e369a01766" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account_tiers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "premium" double precision NOT NULL, "coverageDetails" text NOT NULL, CONSTRAINT "PK_ae5be89178a918a3125cec9a575" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "healthcare_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "coverageType" character varying NOT NULL, "pricingStructure" character varying NOT NULL, "familyPlanAvailable" boolean NOT NULL DEFAULT false, "dependentDiscountRate" double precision, "maxDependents" integer, "status" character varying NOT NULL DEFAULT 'dormant', "planBenefits" json, "minimumUsersRequired" integer, "minimumPremiumRequired" double precision, "hmoId" uuid, CONSTRAINT "PK_855ca6de408439a4425abe7a2e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hmos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "address" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "accountStatus" character varying NOT NULL DEFAULT 'dormant', "verificationComments" character varying, CONSTRAINT "PK_5bb4a0559fe6f4bfb4991f29e00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "balance" numeric(10,2) NOT NULL, "userId" uuid, CONSTRAINT "REL_2ecdb33f23e9a6fc392025c0b9" UNIQUE ("userId"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "claims" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "details" character varying NOT NULL, "documents" json, "userId" uuid, "planId" uuid, CONSTRAINT "PK_96c91970c0dcb2f69fdccd0a698" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "action" character varying NOT NULL, "oldValue" json, "newValue" json, "entityName" character varying NOT NULL, "entityId" character varying, "userId" uuid, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "firstName" character varying NOT NULL, "middleName" character varying, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "dob" TIMESTAMP, "password" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "isEmailVerified" boolean NOT NULL DEFAULT false, "status" character varying NOT NULL DEFAULT 'Pending', "accountStatus" character varying NOT NULL DEFAULT 'dormant', "isDeveloper" boolean NOT NULL DEFAULT false, "roleId" uuid, "hmoId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "permission" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hospitals_plans_healthcare_plans" ("hospitalsId" uuid NOT NULL, "healthcarePlansId" uuid NOT NULL, CONSTRAINT "PK_96b5a12843b64cb1275f9bb149e" PRIMARY KEY ("hospitalsId", "healthcarePlansId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_043df30f72c6d59c4d0aa9be19" ON "hospitals_plans_healthcare_plans" ("hospitalsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0e3f1e2084d2d2366ec7a10a3" ON "hospitals_plans_healthcare_plans" ("healthcarePlansId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "healthcare_plans_account_tiers_account_tiers" ("healthcarePlansId" uuid NOT NULL, "accountTiersId" uuid NOT NULL, CONSTRAINT "PK_c7a315f317ef442dcd8f017bd45" PRIMARY KEY ("healthcarePlansId", "accountTiersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_900c6b1e8272e3b0bfcd736307" ON "healthcare_plans_account_tiers_account_tiers" ("healthcarePlansId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ceab689951f908822b88f2e35" ON "healthcare_plans_account_tiers_account_tiers" ("accountTiersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_4ead1199dff38c1711d7ed2a1e8" FOREIGN KEY ("hmoId") REFERENCES "hmos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_options" ADD CONSTRAINT "FK_30a0d1172d5f4386667f39d2131" FOREIGN KEY ("planId") REFERENCES "healthcare_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_120efc5222412dd6fc23cff4758" FOREIGN KEY ("paymentOptionId") REFERENCES "payment_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_c39d78e8744809ece8ca95730e2" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dependents" ADD CONSTRAINT "FK_3fa0cbb317c7bfb6de7a51a0b13" FOREIGN KEY ("subscriptionId") REFERENCES "plan_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_subscriptions" ADD CONSTRAINT "FK_1bb3ac7bc1694014935c12f4230" FOREIGN KEY ("queuedPlanId") REFERENCES "healthcare_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_subscriptions" ADD CONSTRAINT "FK_65ac39fa4422537e51973072020" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_subscriptions" ADD CONSTRAINT "FK_9cb48a82b208ef7c5ee0a270f33" FOREIGN KEY ("planId") REFERENCES "healthcare_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_subscriptions" ADD CONSTRAINT "FK_30916b6762cd9f5c365ffbccba7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_auth_request" ADD CONSTRAINT "FK_a6b8a4f2a832c71654e11898937" FOREIGN KEY ("subscriptionsId") REFERENCES "plan_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_097622bc12666c3412a99e8c649" FOREIGN KEY ("providerClaimId") REFERENCES "health_provider_claims"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_829532ff766505ad7c71592c6a5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_provider_claims" ADD CONSTRAINT "FK_470b0a2c135dc3c85080e0f19d0" FOREIGN KEY ("hmoId") REFERENCES "hmos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_provider_claims" ADD CONSTRAINT "FK_3b989d90a9c788014bfe8021193" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_plans" ADD CONSTRAINT "FK_8b65c858a16f8be1b39ddecb7cf" FOREIGN KEY ("hmoId") REFERENCES "hmos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "claims" ADD CONSTRAINT "FK_299a3ed5259cccd5cf541512e73" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "claims" ADD CONSTRAINT "FK_e80ba16b6420989b8bdaaa254b9" FOREIGN KEY ("planId") REFERENCES "healthcare_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_cfa83f61e4d27a87fcae1e025ab" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_8db948f9d087fd6acb8e1e7081c" FOREIGN KEY ("hmoId") REFERENCES "hmos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospitals_plans_healthcare_plans" ADD CONSTRAINT "FK_043df30f72c6d59c4d0aa9be19e" FOREIGN KEY ("hospitalsId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospitals_plans_healthcare_plans" ADD CONSTRAINT "FK_d0e3f1e2084d2d2366ec7a10a31" FOREIGN KEY ("healthcarePlansId") REFERENCES "healthcare_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_plans_account_tiers_account_tiers" ADD CONSTRAINT "FK_900c6b1e8272e3b0bfcd736307b" FOREIGN KEY ("healthcarePlansId") REFERENCES "healthcare_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_plans_account_tiers_account_tiers" ADD CONSTRAINT "FK_1ceab689951f908822b88f2e351" FOREIGN KEY ("accountTiersId") REFERENCES "account_tiers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "healthcare_plans_account_tiers_account_tiers" DROP CONSTRAINT "FK_1ceab689951f908822b88f2e351"`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_plans_account_tiers_account_tiers" DROP CONSTRAINT "FK_900c6b1e8272e3b0bfcd736307b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospitals_plans_healthcare_plans" DROP CONSTRAINT "FK_d0e3f1e2084d2d2366ec7a10a31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospitals_plans_healthcare_plans" DROP CONSTRAINT "FK_043df30f72c6d59c4d0aa9be19e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_8db948f9d087fd6acb8e1e7081c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_cfa83f61e4d27a87fcae1e025ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "claims" DROP CONSTRAINT "FK_e80ba16b6420989b8bdaaa254b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "claims" DROP CONSTRAINT "FK_299a3ed5259cccd5cf541512e73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "healthcare_plans" DROP CONSTRAINT "FK_8b65c858a16f8be1b39ddecb7cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_provider_claims" DROP CONSTRAINT "FK_3b989d90a9c788014bfe8021193"`,
    );
    await queryRunner.query(
      `ALTER TABLE "health_provider_claims" DROP CONSTRAINT "FK_470b0a2c135dc3c85080e0f19d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_829532ff766505ad7c71592c6a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_097622bc12666c3412a99e8c649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_auth_request" DROP CONSTRAINT "FK_a6b8a4f2a832c71654e11898937"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_subscriptions" DROP CONSTRAINT "FK_30916b6762cd9f5c365ffbccba7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_subscriptions" DROP CONSTRAINT "FK_9cb48a82b208ef7c5ee0a270f33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_subscriptions" DROP CONSTRAINT "FK_65ac39fa4422537e51973072020"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_subscriptions" DROP CONSTRAINT "FK_1bb3ac7bc1694014935c12f4230"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dependents" DROP CONSTRAINT "FK_3fa0cbb317c7bfb6de7a51a0b13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_c39d78e8744809ece8ca95730e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_120efc5222412dd6fc23cff4758"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_options" DROP CONSTRAINT "FK_30a0d1172d5f4386667f39d2131"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_4ead1199dff38c1711d7ed2a1e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ceab689951f908822b88f2e35"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_900c6b1e8272e3b0bfcd736307"`,
    );
    await queryRunner.query(
      `DROP TABLE "healthcare_plans_account_tiers_account_tiers"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d0e3f1e2084d2d2366ec7a10a3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_043df30f72c6d59c4d0aa9be19"`,
    );
    await queryRunner.query(`DROP TABLE "hospitals_plans_healthcare_plans"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "claims"`);
    await queryRunner.query(`DROP TABLE "wallets"`);
    await queryRunner.query(`DROP TABLE "hmos"`);
    await queryRunner.query(`DROP TABLE "healthcare_plans"`);
    await queryRunner.query(`DROP TABLE "account_tiers"`);
    await queryRunner.query(`DROP TABLE "hospitals"`);
    await queryRunner.query(`DROP TABLE "health_provider_claims"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "health_provider_claim_payments"`);
    await queryRunner.query(
      `DROP TYPE "public"."health_provider_claim_payments_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "pre_auth_request"`);
    await queryRunner.query(`DROP TABLE "plan_subscriptions"`);
    await queryRunner.query(`DROP TABLE "dependents"`);
    await queryRunner.query(
      `DROP TYPE "public"."dependents_relationship_enum"`,
    );
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_paymentmethod_enum"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    await queryRunner.query(`DROP TABLE "payment_options"`);
    await queryRunner.query(`DROP TABLE "hospital_info"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
