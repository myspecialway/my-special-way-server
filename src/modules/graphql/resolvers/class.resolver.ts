import { Resolver, Query, ResolveProperty, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { Asset, DBOperation, NO_PERMISSION, Permission, Permissions } from './permissionRules';
import { Get} from '../../../utils/get';

@Resolver('Class')
export class ClassResolver {
    constructor(
        private classPersistence: ClassPersistenceService,
        private userPersistenceService: UsersPersistenceService,
    ) {}

    @Query('classes')
    async getClasses(obj, args, context, info) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.classPersistence.getAll();
    }

    @Query('classById')
    async getClassById(obj, args, context, info) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.classPersistence.getById(args.id);
    }

    @Query('classByName')
    async getClassByName(obj, args, context, info) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.classPersistence.getByName(args.name);
    }

    @ResolveProperty('schedule')
    getClassSchedule(obj, {} , context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return obj.schedule || [];
    }

    @ResolveProperty('students')
    async getStudentsByClassId(obj, args, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.STUDENT);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.userPersistenceService.getStudentsByClassId(obj._id.toString());
    }

    @Mutation('createClass')
    async createClass(obj, { class: newClass }, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.CLASS);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.classPersistence.createClass(newClass);
    }

    @Mutation('updateClass')
    async updateClass(obj, {id, class: classObj}, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.CLASS);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.classPersistence.updateClass(id, classObj);
    }

    @Mutation('deleteClass')
    async deleteClass(obj, {id}, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.CLASS);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.classPersistence.deleteClass(id);
    }
}
