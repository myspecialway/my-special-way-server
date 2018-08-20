import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { LessonPersistenceService } from '../../persistence/lesson.persistence.service';
import {Asset, DBOperation, NO_PERMISSION, Permission, Permissions} from './permissionRules';
import {Get} from '../../../utils/get';

@Resolver('Lesson')
export class LessonResolver {
  constructor(private lessonPersistence: LessonPersistenceService) {}

  @Query('lessons')
  async getLessons(_, {}, context) {
      if (Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.LESSON) === Permission.FORBID) {
          throw new Error(NO_PERMISSION);
      }
      return this.lessonPersistence.getAll();
  }

  @Mutation('createLesson')
  async createLesson(_, { lesson }, context) {
      if (Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.LESSON) === Permission.FORBID) {
          throw new Error(NO_PERMISSION);
      }
      return this.lessonPersistence.createLesson(lesson);
  }

  @Mutation('updateLesson')
  async updateLesson(_, {id, lesson}, context) {
      if (Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.LESSON) === Permission.FORBID) {
          throw new Error(NO_PERMISSION);
      }
      return this.lessonPersistence.updateLesson(id, lesson);
  }

  @Mutation('deleteLesson')
  async deleteLesson(_, {id}, context) {
      if (Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.LESSON) === Permission.FORBID) {
          throw new Error(NO_PERMISSION);
      }
      return this.lessonPersistence.deleteLesson(id);
  }
}
