import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Textbook } from './entities/textbook.entity';
import { Unit } from './entities/unit.entity';
import { Lesson } from './entities/lesson.entity';
import { Exercise } from './entities/exercise.entity';
import { Material } from './entities/material.entity';

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

  private async seed() {
    const existingTextbook = await this.textbookRepository.findOne({
      where: { title: 'Roadmap A1' },
    });

    if (existingTextbook) {
      return;
    }

    const textbook = this.textbookRepository.create({
      title: 'Roadmap A1',
      description: 'Beginner English course for absolute beginners',
      level: 'A1',
    });
    await this.textbookRepository.save(textbook);

    const unit = this.unitRepository.create({
      title: 'Unit 1',
      order: 1,
      textbook,
    });
    await this.unitRepository.save(unit);

    const lesson = this.lessonRepository.create({
      title: '1A Hello',
      order: 1,
      unit,
    });
    await this.lessonRepository.save(lesson);

    const exercise1 = this.exerciseRepository.create({
      title: 'Vocabulary: Countries',
      type: 'match',
      payload: {
        pairs: [
          { id: 1, country: 'France', flagId: 'fr' },
          { id: 2, country: 'Germany', flagId: 'de' },
          { id: 3, country: 'Spain', flagId: 'es' },
          { id: 4, country: 'Italy', flagId: 'it' },
        ],
      },
      order: 1,
      lesson,
    });
    await this.exerciseRepository.save(exercise1);

    const exercise2 = this.exerciseRepository.create({
      title: 'Pronunciation: Stress Patterns',
      type: 'categorize',
      payload: {
        words: [
          { id: 1, word: 'apple', pattern: 'o' },
          { id: 2, word: 'banana', pattern: 'Oo' },
          { id: 3, word: 'computer', pattern: 'oO' },
          { id: 4, word: 'elephant', pattern: 'Ooo' },
        ],
        columns: ['o', 'Oo', 'oO', 'Ooo'],
      },
      order: 2,
      lesson,
    });
    await this.exerciseRepository.save(exercise2);

    const exercise3 = this.exerciseRepository.create({
      title: 'Reading: Greetings',
      type: 'fill_in_the_blank',
      payload: {
        text: 'Hello! My name {{gap_1}} John. I {{gap_2}} from London. Nice to {{gap_3}} you!',
        gaps: [
          { id: 'gap_1', answer: 'is', options: ['is', 'am', 'are'] },
          { id: 'gap_2', answer: 'am', options: ['is', 'am', 'are'] },
          { id: 'gap_3', answer: 'meet', options: ['meet', 'meat', 'met'] },
        ],
      },
      order: 3,
      lesson,
    });
    await this.exerciseRepository.save(exercise3);

    const material = this.materialRepository.create({
      title: 'Unit 1 Audio',
      type: 'audio',
      url: 'https://example.com/audio/unit1.mp3',
      description: 'Audio materials for Unit 1 - Greetings and Introductions',
      unit,
    });
    await this.materialRepository.save(material);
  }
}
