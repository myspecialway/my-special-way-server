import { Resolver, Query, ResolveProperty, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import {Asset, checkAndGetBasePermission, DBOperation, NO_PERMISSION, Permission, Permissions} from '../../permissions/permission.interface';
import { Get} from '../../../utils/get';
import {UserDbModel} from '../../../models/user.db.model';

@Resolver('Class')
export class ClassResolver {
    constructor(
        private classPersistence: ClassPersistenceService,
        private userPersistenceService: UsersPersistenceService,
    ) {}

    @Query('classes')
    async getClasses(obj, args, context, info) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        const classes = await this.classPersistence.getAll();

        if (permission === Permission.OWN) {
            // find classes of teacher only
            const teacher: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            return classes.filter((cls) => cls.id === teacher.class_id);
        }

        return classes;
    }

    @Query('classById')
    async getClassById(obj, args, context, info) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        const cls =  await this.classPersistence.getById(args.id);
        if (permission === Permission.OWN) {
            const user: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            return (cls._id === user.class_id) ? cls : null;
        }

        return cls;
    }

    @Query('classByName')
    async getClassByName(obj, args, context, info) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        const cls = await this.classPersistence.getByName(args.name);
        if (permission === Permission.OWN) {
            const user: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            return (cls._id === user.class_id) ? cls : null;
        }
        return cls;
    }

    @ResolveProperty('schedule')
    getClassSchedule(obj, {} , context) {
        return obj.schedule || [];
    }

    @ResolveProperty('students')
    async getStudentsByClassId(obj, args, context) {
        return this.userPersistenceService.getStudentsByClassId(obj._id.toString());
    }

    @Mutation('createClass')
    async createClass(obj, { class: newClass }, context) {
        checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.CLASS);
        return this.classPersistence.createClass(newClass);
    }

    @Mutation('updateClass')
    async updateClass(obj, {id, class: classObj}, context) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.CLASS);
        if (permission === Permission.OWN) {
            const user: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            if (user.class_id !== id) {
                throw new Error(NO_PERMISSION);
            }
        }
        return this.classPersistence.updateClass(id, classObj);
    }

    @Mutation('deleteClass')
    async deleteClass(obj, {id}, context) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.CLASS);
        if (permission === Permission.OWN) {
            const user: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            if (user.class_id !== id) {
                throw new Error(NO_PERMISSION);
            }
        }
        return this.classPersistence.deleteClass(id);
    }
}
