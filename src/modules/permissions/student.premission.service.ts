import { Injectable } from '@nestjs/common';
import { checkAndGetBasePermission, DBOperation, Asset, Permission, NO_PERMISSION } from './permission.interface';
import { UserDbModel } from 'models/user.db.model';
import { UsersPersistenceService } from '../persistence/users.persistence.service';
import { Get } from '../../utils/get';

@Injectable()
export class StudentPermissionService {

    constructor(private usersPersistence: UsersPersistenceService) { }

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

    async getAndValidateStudentsInRequesterClass(op: DBOperation, id, context): Promise<[Permission, UserDbModel[]]> {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), op, Asset.STUDENT);
        if (permission === Permission.OWN) {
            // find student in requester's class
            const requester: UserDbModel = await this.usersPersistence.getById(context.user.id);
            const requesterClassId = requester.class_id ? requester.class_id.toString() : '';
            const [, students] = await this.usersPersistence.getStudentsByClassId(requesterClassId);
            if (id) {
                return this.getStudentsByClass(students, id);
            }
            return [Permission.OWN, students];
        }
        return [permission, null];
    }

    private getStudentsByClass(students: UserDbModel[], classId: string): [Permission, UserDbModel[]] {
        const studentsInClass = students.filter((obj) => obj._id.toString() === classId.toString());
        if (!studentsInClass || studentsInClass.length === 0) {
            throw new Error(NO_PERMISSION);
        }
        return [Permission.OWN, studentsInClass];
    }
}
