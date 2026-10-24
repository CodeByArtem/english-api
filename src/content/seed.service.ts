import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Textbook } from './entities/textbook.entity';
import { Unit } from './entities/unit.entity';
import { Lesson } from './entities/lesson.entity';
import { Exercise } from './entities/exercise.entity';
import { Material } from './entities/material.entity';
import {
  seedUnit1,
  seedUnit2,
  seedUnit3,
  seedUnit4,
  seedUnit5,
} from './seeds';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Textbook)
    private readonly textbookRepository: Repository<Textbook>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  private async ensureUnit(
    id: string,
    title: string,
    order: number,
    textbook: Textbook,
  ): Promise<Unit> {
    let unit = await this.unitRepository.findOne({ where: { id } });
    if (!unit) {
      unit = this.unitRepository.create({
        id,
        title,
        order,
        textbook,
      });
      await this.unitRepository.save(unit);
    }
    return unit;
  }

  private async seed() {
    console.log('Starting database seeding...');

    let textbook = await this.textbookRepository.findOne({
      where: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
    });

    if (!textbook) {
      textbook = this.textbookRepository.create({
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        title: 'Roadmap A1: Beginner English',
        description:
          'A comprehensive beginner English course covering basic grammar, vocabulary, and conversation skills.',
        level: 'A1',
      });
      await this.textbookRepository.save(textbook);
    }

    const unit1 = await this.ensureUnit(
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
      'Unit 1: Getting Started',
      1,
      textbook,
    );
    const unit2 = await this.ensureUnit(
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
      'Unit 2: Families and Friends',
      2,
      textbook,
    );
    const unit3 = await this.ensureUnit(
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
      'Unit 3: Places',
      3,
      textbook,
    );
    const unit4 = await this.ensureUnit(
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
      'Unit 4: Possessions and People',
      4,
      textbook,
    );
    const unit5 = await this.ensureUnit(
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
      'Unit 5: Day to Day',
      5,
      textbook,
    );

    // Seed Lessons & Exercises by Unit
    await seedUnit1(unit1, this.lessonRepository, this.exerciseRepository);
    await seedUnit2(unit2, this.lessonRepository);
    await seedUnit3(unit3, this.lessonRepository);
    await seedUnit4(unit4, this.lessonRepository);
    await seedUnit5(unit5, this.lessonRepository);

    // Audio Materials
    const material1 = this.materialRepository.create({
      id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      title: 'Unit 1 Audio',
      type: 'audio',
      url: '/audio/1.1.mp3',
      description: 'Audio materials for Unit 1 - Greetings and Introductions',
      unit: unit1,
    });
    await this.materialRepository.save(material1);

    const material2 = this.materialRepository.create({
      id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      title: 'Unit 2 Audio',
      type: 'audio',
      url: '/audio/2.1.mp3',
      description: 'Audio materials for Unit 2 - Families and Everyday Things',
      unit: unit2,
    });
    await this.materialRepository.save(material2);

    console.log('Database seeding completed successfully!');
  }
}
