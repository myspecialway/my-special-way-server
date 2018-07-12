import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { LessonPersistenceService } from '../../persistence/lesson.persistence.service';

@Resolver('Lesson')
export class LessonResolver {
  constructor(private lessonPersistence: LessonPersistenceService) {}

  @Query('lessons')
  async getLessons() {
    return this.lessonPersistence.getAll();
  }

  @Mutation('createLesson')
  async createLesson(_, { lesson }) {
    return this.lessonPersistence.createLesson(lesson);
  }

  @Mutation('updateLesson')
  async updateLesson(_, {id, lesson}) {
      return this.lessonPersistence.updateLesson(id, lesson);
  }

  @Mutation('deleteLesson')
  async deleteLesson(_, {id}) {
      return this.lessonPersistence.deleteLesson(id);
  }
}
