import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1745663832201 implements MigrationInterface {
  name = 'Migration1745663832201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account_tiers" DROP CONSTRAINT "FK_account_tiers_hmo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_hmo"`,
    );
    await queryRunner.query(`ALTER TABLE "account_tiers" DROP COLUMN "hmoId"`);
    await queryRunner.query(
      `ALTER TABLE "hospitals" ADD "status" character varying NOT NULL DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospitals" ADD "accountStatus" character varying NOT NULL DEFAULT 'dormant'`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospitals" ADD "verificationComments" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospitals" DROP COLUMN "verificationComments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospitals" DROP COLUMN "accountStatus"`,
    );
    await queryRunner.query(`ALTER TABLE "hospitals" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "account_tiers" ADD "hmoId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_hmo" FOREIGN KEY ("hmoId") REFERENCES "hmos"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_tiers" ADD CONSTRAINT "FK_account_tiers_hmo" FOREIGN KEY ("hmoId") REFERENCES "hmos"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
