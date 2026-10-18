import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubmissionAudioTable1792000000000 implements MigrationInterface {
  name = 'CreateSubmissionAudioTable1792000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "submission_audio" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "submission_id" uuid NOT NULL,
        "exercise_key" character varying NOT NULL,
        "mime_type" character varying NOT NULL,
        "size_bytes" integer NOT NULL,
        "data" bytea NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_submission_audio_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_submission_audio_submission_exercise" UNIQUE ("submission_id", "exercise_key"),
        CONSTRAINT "FK_submission_audio_submission_id" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_submission_audio_submission_id" ON "submission_audio" ("submission_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "submission_audio" CASCADE;
    `);
  }
}
