import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';

@Controller('content')
@UseGuards(AuthGuard('jwt'))
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('textbooks')
  findAllTextbooks() {
    return this.contentService.findAllTextbooks();
  }

  @Get('lessons/:id')
  findLessonById(@Param('id') id: string) {
    return this.contentService.findLessonById(id);
  }
}
