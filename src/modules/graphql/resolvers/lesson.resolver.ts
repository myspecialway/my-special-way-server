import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { LessonPersistenceService } from '../../persistence/lesson.persistence.service';

@Resolver('Lesson')
export class LessonResolver {
  constructor(private lessonPersistence: LessonPersistenceService) {}

  @Query('lessons')
  async getLessons(_, {}, context) {
    return this.lessonPersistence.getAll();
  }

  @Mutation('createLesson')
  async createLesson(_, { lesson }, context) {
    return this.lessonPersistence.createLesson(lesson);
  }

  @Mutation('updateLesson')
  async updateLesson(_, {id, lesson, context}) {
      return this.lessonPersistence.updateLesson(id, lesson);
  }

  @Mutation('deleteLesson')
  async deleteLesson(_, {id}, context) {
      return this.lessonPersistence.deleteLesson(id);
  }
}
