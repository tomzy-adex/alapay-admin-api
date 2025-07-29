import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1745230631570 implements MigrationInterface {
  name = 'Migration1745230631570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."provider_enrollments_status_enum" AS ENUM('active', 'inactive', 'pending')`,
    );
    await queryRunner.query(
      `CREATE TABLE "provider_enrollments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "startDate" date NOT NULL, "endDate" date NOT NULL, "status" "public"."provider_enrollments_status_enum" NOT NULL DEFAULT 'pending', "terms" jsonb, "provider_id" uuid, "hmo_id" uuid, CONSTRAINT "PK_803e74917f51279dda0eb12a56b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "provider_ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "rating" integer NOT NULL, "review" text, "metrics" jsonb, "provider_id" uuid, "user_id" uuid, CONSTRAINT "PK_c27aac86b707c56a15dfdcfcd59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "provider_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" text, "basePrice" numeric(10,2), "coverageDetails" jsonb, "provider_id" uuid, CONSTRAINT "PK_c907262c804f6e6a2888ed5e630" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "startDate" date NOT NULL, "endDate" date NOT NULL, "pricePerEmployee" numeric(10,2) NOT NULL, "maxEmployees" integer NOT NULL, "benefits" jsonb, "coverage" jsonb, "status" character varying NOT NULL DEFAULT 'active', "notes" text, "organization_id" uuid, "plan_id" uuid, CONSTRAINT "PK_da81b8c2e34901ae35a54a8af49" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_renewals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "renewalDate" date NOT NULL, "expiryDate" date NOT NULL, "renewalAmount" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "isAutoRenewal" boolean NOT NULL DEFAULT false, "notes" text, "organization_id" uuid, "plan_id" uuid, CONSTRAINT "PK_e28af8999afdbe9fea9ba75be9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedFrom" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" text, "contactInfo" jsonb, "businessInfo" jsonb, "status" character varying NOT NULL DEFAULT 'Pending', "accountStatus" character varying NOT NULL DEFAULT 'active', "employeeCount" integer NOT NULL DEFAULT '0', "enrolledEmployeeCount" integer NOT NULL DEFAULT '0', "hmo_id" uuid, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "organization_id" uuid`);
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
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "organization_renewals"`);
    await queryRunner.query(`DROP TABLE "organization_plans"`);
    await queryRunner.query(`DROP TABLE "provider_services"`);
    await queryRunner.query(`DROP TABLE "provider_ratings"`);
    await queryRunner.query(`DROP TABLE "provider_enrollments"`);
    await queryRunner.query(
      `DROP TYPE "public"."provider_enrollments_status_enum"`,
    );
  }
}
