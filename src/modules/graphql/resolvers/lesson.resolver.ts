import { Resolver, Query, ResolveProperty, Mutation } from '@nestjs/graphql';
import { LessonPersistenceService } from '../../persistence/lesson.persistence.service';

@Resolver('Lesson')
export class LessonResolver {
  constructor(private lessonPersistence: LessonPersistenceService) {}

  @Query('lessons')
  async getLessons(obj, args, context) {
    return this.lessonPersistence.getAll();
  }

  @Mutation('createLesson')
  async createLesson(obj, { lesson }) {
    return this.lessonPersistence.createLesson(lesson);
  }

  @Mutation('updateLesson')
  async updateLesson(obj, {id, lesson}) {
      return this.lessonPersistence.updateLesson(id, lesson);
  }

  @Mutation('deleteLesson')
  async deleteLesson(obj, {id}) {
      return this.lessonPersistence.deleteLesson(id);
  }
}
