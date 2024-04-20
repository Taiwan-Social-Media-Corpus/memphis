import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1711190514215 implements MigrationInterface {
  name = 'Init1711190514215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character(25) NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" text NOT NULL, "refresh_token" text NOT NULL, "password" character varying NOT NULL, "disabled" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9b5b525a96ddc2c5647d7f7fa" ON "users" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" character(25) NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" text NOT NULL, "refresh_token" text NOT NULL, "password" character varying NOT NULL, "disabled" boolean NOT NULL DEFAULT false, "role_id" integer NOT NULL, CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f9042e2b141a53e456886adee" ON "admins" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_051db7d37d478a69a7432df147" ON "admins" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_051db7d37d478a69a7432df147"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f9042e2b141a53e456886adee"`,
    );
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9b5b525a96ddc2c5647d7f7fa"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
