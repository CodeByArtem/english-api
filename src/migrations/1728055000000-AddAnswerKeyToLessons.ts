import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnswerKeyToLessons1728055000000 implements MigrationInterface {
    name = 'AddAnswerKeyToLessons1728055000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" ADD "answerKey" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "answerKey"`);
    }
}
