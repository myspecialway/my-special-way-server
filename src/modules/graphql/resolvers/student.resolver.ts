import { Resolver, Query, Mutation, ResolveProperty } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UserDbModel, UserRole } from '../../../models/user.db.model';
import { Asset, checkAndGetBasePermission, DBOperation, NO_PERMISSION, Permission } from '../../permissions/permission.interface';
import { Get } from '../../../utils/get';

@Resolver('Student')
export class StudentResolver {
    constructor(private usersPersistence: UsersPersistenceService, private classPersistence: ClassPersistenceService) { }

    @Query('students')
    async getStudents(_, { }, context) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.STUDENT);
        if (permission === Permission.OWN) {
            // find students in teacher's class
            const teacher: UserDbModel = await this.usersPersistence.getById(context.user.id);
            const teacherClassId = teacher.class_id ? teacher.class_id.toString() : '';
            const [, students] = await this.usersPersistence.getStudentsByClassId(teacherClassId);
            return students;
        }

        return this.usersPersistence.getUsersByFilters({ role: UserRole.STUDENT });
    }

    @Query('student')
    async getStudentById(_, args, context) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.STUDENT);
        if (permission === Permission.OWN) {
            // find student in teacher's class
            const teacher: UserDbModel = await this.usersPersistence.getById(context.user.id);
            const teacherClassId = teacher.class_id ? teacher.class_id.toString() : '';
            const [, students] = await this.usersPersistence.getStudentsByClassId(teacherClassId);
            return students.find((obj) => {
                return obj._id.toString() === args.id.toString();
            });
        }
        const users = await this.usersPersistence.getUserByFilters({ role: UserRole.STUDENT }, args.id);
        return users;
    }

    @ResolveProperty('class')
    async getStudentClass(obj, { }, context) {
        const objClassId = obj.class_id ? obj.class_id.toString() : '';
        return this.classPersistence.getById(objClassId);
    }

    @ResolveProperty('schedule')
    async getStudentSchedule(obj) {
        const [, response] = await this.usersPersistence.getStudentSchedule(obj);
        return response;
    }

    @Mutation('createStudent')
    async createStudent(_, { student }, context) {
        checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.STUDENT);
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.createUser(student, UserRole.STUDENT);
        return response;
    }

    @Mutation('updateStudent')
    async updateStudent(_, { id, student }, context) {
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.STUDENT);
        if (permission === Permission.OWN) {
            // find student in teacher's class
            const teacher: UserDbModel = await this.usersPersistence.getById(context.user.id);
            const teacherClassId = teacher.class_id ? teacher.class_id.toString() : '';
            const [, students] = await this.usersPersistence.getStudentsByClassId(teacherClassId);
            const studentInClass = students.find((obj) => obj._id.toString() === id.toString());
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
        const permission = checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.STUDENT);
        if (permission === Permission.OWN) {
            // find student in teacher's class
            const teacher: UserDbModel = await this.usersPersistence.getById(context.user.id);
            const teacherClassId = teacher.class_id ? teacher.class_id.toString() : '';
            const [, students] = await this.usersPersistence.getStudentsByClassId(teacherClassId);
            const studentInClass = students.find((obj) => obj._id.toString() === id.toString());
            if (!studentInClass) {
                throw new Error(NO_PERMISSION);
            }
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
