import { Resolver, Query, ResolveProperty, Mutation } from '@nestjs/graphql';
import { ClassDbModel } from '../../../../models/class.db.model';
import { ClassLogic } from './services/class-logic.service';
import { ClassPersistenceService } from '../../../persistence/class.persistence.service';
import { UsersPersistenceService } from '../../../persistence/users.persistence.service';
import { Asset, checkAndGetBasePermission, DBOperation, NO_PERMISSION, Permission } from '../../../permissions/permission.interface';
import { UserDbModel } from '../../../../models/user.db.model';
import { Get } from '../../../../utils/get';

@Resolver('Class')
export class ClassResolver {
    constructor(
        private classPersistence: ClassPersistenceService,
        private userPersistenceService: UsersPersistenceService,
        private classLogic: ClassLogic,
    ) { }

    @Query('classes')
    async getClasses(obj, args, context, info) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        const classes = await this.classPersistence.getAll();

        if (permission === Permission.OWN) {
            // find classes of teacher only
            const teacher: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            const teacherClassId = teacher.class_id ? teacher.class_id.toString() : '';
            return classes.filter((cls) => cls._id.toString() === teacherClassId);
        }

        return classes;
    }

    @Query('classById')
    async getClassById(obj, args, context, info) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        const cls = await this.classPersistence.getById(args.id);
        if (permission === Permission.OWN) {
            const user: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            const userClassId = user.class_id ? user.class_id.toString() : '';
            return (cls._id.toString() === userClassId) ? cls : null;
        }

        return cls;
    }

    @Query('classByName')
    async getClassByName(obj, args, context, info) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.CLASS);
        const cls = await this.classPersistence.getByName(args.name);
        if (permission === Permission.OWN) {
            const user: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            const userClassId = user.class_id ? user.class_id.toString() : '';
            return (cls._id.toString() === userClassId) ? cls : null;
        }
        return cls;
    }

    @ResolveProperty('schedule')
    getClassSchedule(obj, { }, context) {
        return obj.schedule || [];
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
        return this.classPersistence.create(newClass);
    }

    @Mutation('updateClass')
    async updateClass(obj, { id, class: classObj }, context) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.CLASS);
        if (permission === Permission.OWN) {
            const user: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            const userClassId = user.class_id ? user.class_id.toString() : '';
            if (userClassId !== id.toString()) {
                throw new Error(NO_PERMISSION);
            }
        }
        return this.classPersistence.updateClass(id, classObj);
    }

    @Mutation('deleteClass')
    async deleteClass(obj, { id }, context) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.CLASS);
        if (permission === Permission.OWN) {
            const user: UserDbModel = await this.userPersistenceService.getById(context.user.id);
            const userClassId = user.class_id ? user.class_id.toString() : '';
            if (userClassId !== id.toString()) {
                throw new Error(NO_PERMISSION);
            }
        }
        return this.classPersistence.deleteClass(id);
    }
}
