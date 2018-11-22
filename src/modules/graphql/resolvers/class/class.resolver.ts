import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { ClassDbModel } from '../../../../models/class.db.model';
import { ClassLogic } from './services/class-logic.service';
import { ClassPersistenceService } from '../../../persistence/class.persistence.service';
import { UsersPersistenceService } from '../../../persistence/users.persistence.service';
import {
  Asset,
  checkAndGetBasePermission,
  DBOperation,
  NO_PERMISSION,
  Permission,
} from '../../../permissions/permission.interface';
import { UserDbModel } from '../../../../models/user.db.model';
import { Get } from '../../../../utils/get';
import { ClassPermissionService } from '../../../permissions/class.permission.service';
import { LessonPersistenceService } from '../../../persistence/lesson.persistence.service';

@Resolver('Class')
export class ClassResolver {
  constructor(
    private classPersistence: ClassPersistenceService,
    private userPersistenceService: UsersPersistenceService,
    private classPermissionService: ClassPermissionService,
    private classLogic: ClassLogic,
    private lessonPersistence: LessonPersistenceService,
  ) {}

  @Query('classes')
  async getClasses(obj, args, context, info) {
    const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
    const classes = await this.classPersistence.getAll();

    if (permission === Permission.OWN) {
      // find classes of requester only
      const requester: UserDbModel = await this.userPersistenceService.getById(context.user.id);
      console.log(requester);
      const requesterClassId = requester.class_id ? requester.class_id.toString() : '';
      return classes.filter((cls) => cls._id.toString() === requesterClassId);
    }

    return classes;
  }

  @Query('classById')
  async getClassById(obj, args, context, info) {
    const cls = await this.classPersistence.getById(args.id);
    return await this.classPermissionService.getAndValidateClassOfRequster(cls, context);
  }

  @Query('classByName')
  async getClassByName(obj, args, context, info) {
    const cls = await this.classPersistence.getByName(args.name);
    return await this.classPermissionService.getAndValidateClassOfRequster(cls, context);
  }

  @ResolveProperty('schedule')
  async getClassSchedule(obj, {}, context) {
    const schedule = obj.schedule || [];
    if (!schedule || !schedule.length || schedule.length === 0) {
      return await Promise.resolve([]);
    }
    if (schedule.filter((s) => s.lesson).length === 0) {
      // no lesson to check
      return await schedule;
    }
    const allLessons = await this.lessonPersistence.getAll();
    schedule.forEach((scheduleItem) => {
      const found = allLessons.filter((lesson) => {
        return lesson._id.toString() === (scheduleItem.lesson._id || '').toString();
      });
      if (found && found.length > 0) {
        scheduleItem.lesson = found[0];
      }
    });
    return await schedule;
  }

  @ResolveProperty('students')
  async getStudentsByClassId(obj, args, context) {
    const [error, students] = await this.userPersistenceService.getStudentsByClassId(obj._id.toString());

    if (error) {
      throw error;
    }

    return students;
  }

  @Mutation('createClass')
  async createClass(obj, { class: newClass }: { class: ClassDbModel }, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.CLASS);
    const [error, schedule] = this.classLogic.buildDefaultSchedule(newClass.grade);
    if (error) {
      return error;
    }

    newClass.schedule = schedule;
    return this.classPersistence.createClass(newClass);
  }

  @Mutation('updateClass')
  async updateClass(obj, { id, class: classObj }, context) {
    const permission = await this.classPermissionService.validateObjClassMatchRequester(
      DBOperation.UPDATE,
      id,
      context,
    );
    if (permission === Permission.FORBID) {
      throw new Error(NO_PERMISSION);
    }
    return this.classPersistence.updateClass(id, classObj);
  }

  @Mutation('deleteClass')
  async deleteClass(obj, { id }, context) {
    const permission = await this.classPermissionService.validateObjClassMatchRequester(
      DBOperation.DELETE,
      id,
      context,
    );
    if (permission === Permission.FORBID) {
      throw new Error(NO_PERMISSION);
    }
    return this.classPersistence.deleteClass(id);
  }
}
