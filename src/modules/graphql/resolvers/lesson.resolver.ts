import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { LessonPersistenceService } from '../../persistence/lesson.persistence.service';
import {Asset, checkAndGetBasePermission, DBOperation} from '../../permissions/permission.interface';
import {Get} from '../../../utils/get';

@Resolver('Lesson')
export class LessonResolver {
  constructor(private lessonPersistence: LessonPersistenceService) {}

  @Query('lessons')
  async getLessons(context) {
      checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.LESSON);
      return this.lessonPersistence.getAll();
  }

  @Mutation('createLesson')
  async createLesson({ lesson }, context) {
      checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.LESSON);
      return this.lessonPersistence.createLesson(lesson);
  }

  @Mutation('updateLesson')
  async updateLesson({id, lesson}, context) {
      checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.LESSON);
      return this.lessonPersistence.updateLesson(id, lesson);
  }

  @Mutation('deleteLesson')
  async deleteLesson({id}, context) {
      checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.LESSON);
      return this.lessonPersistence.deleteLesson(id);
  }
}
