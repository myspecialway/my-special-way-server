import { Injectable } from '@nestjs/common';
import { checkAndGetBasePermission, DBOperation, Asset, Permission, NO_PERMISSION } from './permission.interface';
import { UserDbModel } from 'models/user.db.model';
import { UsersPersistenceService } from '../persistence/users.persistence.service';
import { Get } from '../../utils/get';
import { ClassDbModel } from '../../models/class.db.model';

@Injectable()
export class ClassPermissionService {
  constructor(private usersPersistence: UsersPersistenceService) {}

  async validateObjClassMatchRequester(op: DBOperation, id, context): Promise<Permission> {
    const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), op, Asset.CLASS);
    if (permission === Permission.OWN) {
      const requester: UserDbModel = await this.usersPersistence.getById(context.user.id);
      const requesterClassId = requester.class_id ? requester.class_id.toString() : '';
      if (requesterClassId !== id.toString()) {
        throw new Error(NO_PERMISSION);
      }
    }
    return permission;
  }

  async getAndValidateClassOfRequster(cls: ClassDbModel, context): Promise<ClassDbModel> {
    const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
    if (permission === Permission.OWN) {
      const requester: UserDbModel = await this.usersPersistence.getById(context.user.id);
      const requesterClassId = requester.class_id ? requester.class_id.toString() : '';
      return cls._id.toString() === requesterClassId ? cls : null;
    }
    return cls;
  }
}
