import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStorageKeyToSubmissionAudio1792200000000
  implements MigrationInterface
{
  name = 'AddStorageKeyToSubmissionAudio1792200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission_audio" ADD COLUMN IF NOT EXISTS "storage_key" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_audio" ALTER COLUMN "data" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission_audio" DROP COLUMN IF EXISTS "storage_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_audio" ALTER COLUMN "data" SET NOT NULL`,
    );
  }
}
