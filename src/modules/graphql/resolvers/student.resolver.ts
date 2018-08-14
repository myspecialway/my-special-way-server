import { Resolver, Query, Mutation, ResolveProperty } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UserDbModel, UserRole} from '../../../models/user.db.model';
import { Asset, DBOperation, NO_PERMISSION, Permission, Permissions} from './permissionRules';
import { Get } from '../../../utils/get';

@Resolver('Student')
export class StudentResolver {
    constructor(private usersPersistence: UsersPersistenceService, private classPersistence: ClassPersistenceService) { }

    @Query('students')
    async getStudents(_, {}, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.STUDENT);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        if (permission === Permission.OWN) {
            // find students in teacher's class
            const teacher: UserDbModel = await this.usersPersistence.getById(context.user.id);
            return this.usersPersistence.getStudentsByClassId(teacher.class_id);
        }

        return this.usersPersistence.getUsersByFilters({role: UserRole.STUDENT});
    }

    @Query('student')
    async getStudentById(_, args, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.STUDENT);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        if (permission === Permission.OWN) {
            // find student in teacher's class
            const teacher: UserDbModel = await this.usersPersistence.getById(context.user.id);
            const [err, students] = await this.usersPersistence.getStudentsByClassId(teacher.class_id);
            return students.find((obj) => obj._id === args);
        }
        return this.usersPersistence.getUserByFilters({role: UserRole.STUDENT}, args.id);
    }

    @ResolveProperty('class')
    async getStudentClass(obj, {}, context) {
        return this.classPersistence.getById(obj.class_id);
    }

    @Mutation('createStudent')
    async createStudent(_, { student }, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.STUDENT);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.createUser(student, UserRole.STUDENT);
        return response;
    }

    @Mutation('updateStudent')
    async updateStudent(_, { id, student }, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.STUDENT);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        if (permission === Permission.OWN) {
            // find student in teacher's class
            const teacher: UserDbModel = await this.usersPersistence.getById(context.user.id);
            const [err, students] = await this.usersPersistence.getStudentsByClassId(teacher.class_id);
            const studentInClass = students.find((obj) => obj._id === id);
            if (!studentInClass) {
                throw new Error(NO_PERMISSION);
            }
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.updateUser(id, student, UserRole.STUDENT);
        return response;
    }

    @Mutation('deleteStudent')
    async deleteStudent(_, { id }, context) {
        const permission = Permissions.checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.STUDENT);
        if (permission === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        if (permission === Permission.OWN) {
            // find student in teacher's class
            const teacher: UserDbModel = await this.usersPersistence.getById(context.user.id);
            const [err, students] = await this.usersPersistence.getStudentsByClassId(teacher.class_id);
            const studentInClass = students.find((obj) => obj._id === id);
            if (!studentInClass) {
                throw new Error(NO_PERMISSION);
            }
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
