import { Injectable } from '@nestjs/common';
import { checkAndGetBasePermission, DBOperation, Asset, Permission, NO_PERMISSION } from './permission.interface';
import { UserDbModel } from 'models/user.db.model';
import { UsersPersistenceService } from '../persistence/users.persistence.service';
import { Get } from '../../utils/get';

@Injectable()
export class StudentPermissionService {
  constructor(private usersPersistence: UsersPersistenceService) {}

  async validateObjClassMatchRequester(op: DBOperation, obj, context): Promise<Permission> {
    const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), op, Asset.STUDENT);
    if (permission === Permission.OWN) {
      // find student in requester's class
      const requester: UserDbModel = await this.usersPersistence.getById(context.user.id);
      const requesterClassId = requester.class_id ? requester.class_id.toString() : '';
      const objClassId = obj.class_id ? obj.class_id.toString() : '';
      if (requesterClassId !== objClassId) {
        throw new Error(NO_PERMISSION);
      }
    }
    return permission;
  }

  async checkPermissionForAction(requesedUserId: any, id?: any) {
    if (id === undefined) {
      id = requesedUserId;
    }

    const requester: UserDbModel = await this.usersPersistence.getById(id);
    const requesterClassId = requester.class_id ? requester.class_id.toString() : '';
    const [, classStudents] = await this.usersPersistence.getStudentsByClassId(requesterClassId);

    return this.getClassStudentById(classStudents, requesedUserId);
    // push
  }

  async getCandidateStudentForDelete(op: DBOperation, requesedUserId, context): Promise<[Permission, UserDbModel]> {
    try {
      const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), op, Asset.STUDENT);
      if (permission === Permission.ALLOW) {
        // find student in requester's class
        return this.checkPermissionForAction(requesedUserId);
      }
    } catch (error) {
      return [Permission.FORBID, null];
    }
  }

  async getAndValidateSingleStudentInClass(
    op: DBOperation,
    requesedUserId,
    context,
  ): Promise<[Permission, UserDbModel]> {
    const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), op, Asset.STUDENT);
    if (permission === Permission.OWN) {
      // find student in requester's class
      return this.checkPermissionForAction(requesedUserId, context.user.id);
    }
    return [permission, null];
  }

  async getAndValidateAllStudentsInClass(op: DBOperation, id, context): Promise<[Permission, UserDbModel[]]> {
    const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), op, Asset.STUDENT);
    if (permission === Permission.OWN) {
      // find student in requester's class
      const requester: UserDbModel = await this.usersPersistence.getById(context.user.id);
      const requesterClassId = requester.class_id ? requester.class_id.toString() : '';
      const [, classStudents] = await this.usersPersistence.getStudentsByClassId(requesterClassId);

      return [Permission.OWN, classStudents];
    }
    return [permission, null];
  }

  private getClassStudentById(classStudents: UserDbModel[], studentId: string): [Permission, UserDbModel] {
    const classStudent = classStudents.find((student) => student._id.toString() === studentId);
    if (!classStudent) {
      throw new Error(NO_PERMISSION);
    }
    return [Permission.OWN, classStudent];
  }
}
