import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Textbook } from './entities/textbook.entity';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Textbook)
    private readonly textbookRepository: Repository<Textbook>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async findAllTextbooks() {
    return this.textbookRepository.find({
      relations: {
        units: {
          lessons: true,
        },
      },
      order: {
        units: {
          order: 'ASC',
          lessons: {
            order: 'ASC',
          },
        },
      },
    });
  }

  async findLessonById(id: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: {
        exercises: true,
      },
      select: {
        id: true,
        title: true,
        order: true,
        content: true,
        theory: true,
        media_links: true,
      },
      order: {
        exercises: {
          order: 'ASC',
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }
}
