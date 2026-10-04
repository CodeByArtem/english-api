import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReviewedAnswersToSubmissions1728054000000 implements MigrationInterface {
    name = 'AddReviewedAnswersToSubmissions1728054000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submissions" ADD "reviewedAnswers" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "reviewedAnswers"`);
    }
}
