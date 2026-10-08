import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePhoneAuthCodeEntity implements MigrationInterface {
  name = "CreatePhoneAuthCodeEntity1791469938740";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phoneAuthCode" ("phoneAuthCode_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone" character varying(20) NOT NULL, "code_hash" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "verified" boolean NOT NULL DEFAULT false, "attempts" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4bf061fcf678f09088e5b9078e8" PRIMARY KEY ("phoneAuthCode_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "phoneAuthCode"`);
  }
}
