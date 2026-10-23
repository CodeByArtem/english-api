import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexToSubmissions1792100000000 implements MigrationInterface {
  name = 'AddUniqueIndexToSubmissions1792100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Очищаем возможные дубликаты перед созданием уникального индекса (оставляем самую свежую запись)
    await queryRunner.query(`
      DELETE FROM "submissions" s1
      USING "submissions" s2
      WHERE s1.id != s2.id
        AND s1.student_id = s2.student_id
        AND s1.lesson_id IS NOT NULL
        AND s1.lesson_id = s2.lesson_id
        AND s1.created_at < s2.created_at
    `);

    // 2. Создаем уникальный частичный индекс для уроков
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_submissions_unique_student_lesson"
      ON "submissions" ("student_id", "lesson_id")
      WHERE "lesson_id" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_submissions_unique_student_lesson"
    `);
  }
}
