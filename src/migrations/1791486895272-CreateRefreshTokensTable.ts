import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokensTable1791486895272 implements MigrationInterface {
  name = 'CreateRefreshTokensTable1791486895272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "family_id" uuid NOT NULL,
        "token_hash" character varying(64) NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "used_at" TIMESTAMP WITH TIME ZONE,
        "revoked_at" TIMESTAMP WITH TIME ZONE,
        "replaced_by_id" uuid,
        "client_type" character varying(20),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_tokens_token_hash" UNIQUE ("token_hash"),
        CONSTRAINT "FK_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_refresh_tokens_user_id" ON "refresh_tokens" ("user_id");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_refresh_tokens_family_id" ON "refresh_tokens" ("family_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "refresh_tokens" CASCADE;
    `);
  }
}
