import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Textbook } from './entities/textbook.entity';
import { Unit } from './entities/unit.entity';
import { Lesson } from './entities/lesson.entity';
import { Exercise } from './entities/exercise.entity';
import { Material } from './entities/material.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Textbook, Unit, Lesson, Exercise, Material]),
  ],
  controllers: [ContentController],
  providers: [ContentService, SeedService],
  exports: [ContentService],
})
export class ContentModule {}
