import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1745649608358 implements MigrationInterface {
  name = 'Migration1745649608358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP CONSTRAINT "fk_45ecdc122ed7b5e49941a71484a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP CONSTRAINT "fk_002d43909e713ba8a89787dcfc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP CONSTRAINT "fk_dce87133eee9c72799c1b7c535e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP CONSTRAINT "fk_e3090943544df8c53a1fa9daa85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP CONSTRAINT "fk_f7a9f75184826281d7e79449791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP CONSTRAINT "fk_3674c590144b04f301ebcae63cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP CONSTRAINT "fk_1641d6e6f184dd2876c6be876f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP CONSTRAINT "fk_456ba6e4c5c1335c50a14fcbb77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP CONSTRAINT "fk_da847ce3cb0be5b5462ef8fdd1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "fk_47165fa46dac6e13ce4c881aa1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "fk_21a659804ed7bf61eb91688dea7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "createdat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "updatedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "deletedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "deletedfrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "startdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "enddate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP COLUMN "createdat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP COLUMN "updatedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP COLUMN "deletedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP COLUMN "deletedfrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "createdat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "updatedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "deletedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "deletedfrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "baseprice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "coveragedetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "createdat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "updatedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "deletedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "deletedfrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "startdate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "enddate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "priceperemployee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "maxemployees"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "createdat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "updatedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "deletedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "deletedfrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "renewaldate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "expirydate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "renewalamount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "isautorenewal"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "createdat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "updatedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "deletedat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "deletedfrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "contactinfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "businessinfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "employeecount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "enrolledemployeecount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "accountstatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "deletedFrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "startDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "endDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD "deletedFrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "deletedFrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "basePrice" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "coverageDetails" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "deletedFrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "startDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "endDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "pricePerEmployee" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "maxEmployees" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "deletedFrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "renewalDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "expiryDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "renewalAmount" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "isAutoRenewal" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "deletedFrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "contactInfo" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "businessInfo" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "accountStatus" character varying NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "employeeCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "enrolledEmployeeCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "hmos" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "hmos" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "hmos" ADD "email" text`);
    await queryRunner.query(`ALTER TABLE "hmos" DROP COLUMN "phoneNumber"`);
    await queryRunner.query(`ALTER TABLE "hmos" ADD "phoneNumber" text`);
    await queryRunner.query(`ALTER TABLE "hmos" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "hmos" ADD "address" text`);
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD CONSTRAINT "FK_002d43909e713ba8a89787dcfc5" FOREIGN KEY ("provider_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD CONSTRAINT "FK_45ecdc122ed7b5e49941a71484a" FOREIGN KEY ("hmo_id") REFERENCES "hmos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD CONSTRAINT "FK_e3090943544df8c53a1fa9daa85" FOREIGN KEY ("provider_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD CONSTRAINT "FK_dce87133eee9c72799c1b7c535e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD CONSTRAINT "FK_f7a9f75184826281d7e79449791" FOREIGN KEY ("provider_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD CONSTRAINT "FK_1641d6e6f184dd2876c6be876f4" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD CONSTRAINT "FK_3674c590144b04f301ebcae63cd" FOREIGN KEY ("plan_id") REFERENCES "healthcare_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD CONSTRAINT "FK_da847ce3cb0be5b5462ef8fdd1d" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD CONSTRAINT "FK_456ba6e4c5c1335c50a14fcbb77" FOREIGN KEY ("plan_id") REFERENCES "organization_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_47165fa46dac6e13ce4c881aa1e" FOREIGN KEY ("hmo_id") REFERENCES "hmos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_21a659804ed7bf61eb91688dea7" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_21a659804ed7bf61eb91688dea7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_47165fa46dac6e13ce4c881aa1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP CONSTRAINT "FK_456ba6e4c5c1335c50a14fcbb77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP CONSTRAINT "FK_da847ce3cb0be5b5462ef8fdd1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP CONSTRAINT "FK_3674c590144b04f301ebcae63cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP CONSTRAINT "FK_1641d6e6f184dd2876c6be876f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP CONSTRAINT "FK_f7a9f75184826281d7e79449791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP CONSTRAINT "FK_dce87133eee9c72799c1b7c535e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP CONSTRAINT "FK_e3090943544df8c53a1fa9daa85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP CONSTRAINT "FK_45ecdc122ed7b5e49941a71484a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP CONSTRAINT "FK_002d43909e713ba8a89787dcfc5"`,
    );
    await queryRunner.query(`ALTER TABLE "hmos" DROP COLUMN "address"`);
    await queryRunner.query(
      `ALTER TABLE "hmos" ADD "address" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "hmos" DROP COLUMN "phoneNumber"`);
    await queryRunner.query(
      `ALTER TABLE "hmos" ADD "phoneNumber" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "hmos" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "hmos" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "hmos" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "enrolledEmployeeCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "employeeCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "accountStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "businessInfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "contactInfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "deletedFrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "isAutoRenewal"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "renewalAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "expiryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "renewalDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "deletedFrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "maxEmployees"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "pricePerEmployee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "endDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "startDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "deletedFrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "coverageDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "basePrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "deletedFrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP COLUMN "deletedFrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "endDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "startDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "deletedFrom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "accountstatus" character varying NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "enrolledemployeecount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "employeecount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "businessinfo" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "contactinfo" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "deletedfrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "deletedat" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "updatedat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "createdat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "isautorenewal" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "renewalamount" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "expirydate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "renewaldate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "deletedfrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "deletedat" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "updatedat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD "createdat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "maxemployees" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "priceperemployee" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "enddate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "startdate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "deletedfrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "deletedat" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "updatedat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD "createdat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "coveragedetails" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "baseprice" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "deletedfrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "deletedat" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "updatedat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD "createdat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD "deletedfrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD "deletedat" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD "updatedat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD "createdat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "enddate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "startdate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "deletedfrom" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "deletedat" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "updatedat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD "createdat" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "fk_21a659804ed7bf61eb91688dea7" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "fk_47165fa46dac6e13ce4c881aa1e" FOREIGN KEY ("hmo_id") REFERENCES "hmos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD CONSTRAINT "fk_da847ce3cb0be5b5462ef8fdd1d" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_renewals" ADD CONSTRAINT "fk_456ba6e4c5c1335c50a14fcbb77" FOREIGN KEY ("plan_id") REFERENCES "organization_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD CONSTRAINT "fk_1641d6e6f184dd2876c6be876f4" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_plans" ADD CONSTRAINT "fk_3674c590144b04f301ebcae63cd" FOREIGN KEY ("plan_id") REFERENCES "healthcare_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_services" ADD CONSTRAINT "fk_f7a9f75184826281d7e79449791" FOREIGN KEY ("provider_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD CONSTRAINT "fk_e3090943544df8c53a1fa9daa85" FOREIGN KEY ("provider_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_ratings" ADD CONSTRAINT "fk_dce87133eee9c72799c1b7c535e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD CONSTRAINT "fk_002d43909e713ba8a89787dcfc5" FOREIGN KEY ("provider_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_enrollments" ADD CONSTRAINT "fk_45ecdc122ed7b5e49941a71484a" FOREIGN KEY ("hmo_id") REFERENCES "hmos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
