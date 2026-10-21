import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLessonIdToSubmissions1728045200000 implements MigrationInterface {
  name = 'AddLessonIdToSubmissions1728045200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "lesson_id" uuid REFERENCES "lessons"("id") ON DELETE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP COLUMN IF EXISTS "lesson_id"`,
    );
  }
}
