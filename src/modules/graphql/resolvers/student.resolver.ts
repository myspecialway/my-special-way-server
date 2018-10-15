import { ObjectID } from 'mongodb';
import { Resolver, Query, Mutation, ResolveProperty } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UserRole} from '../../../models/user.db.model';
import { Asset, checkAndGetBasePermission, DBOperation, Permission} from '../../permissions/permission.interface';
import { Get } from '../../../utils/get';
import { StudentPermissionService } from '../../permissions/student.premission.service';
import {Logger} from '@nestjs/common';

@Resolver('Student')
export class StudentResolver {
    private logger = new Logger('StudentResolver');

    constructor(private usersPersistence: UsersPersistenceService,
                private classPersistence: ClassPersistenceService,
                private studentPermissionService: StudentPermissionService) { }

    @Query('students')
    async getStudents(_, {}, context) {
        const [permission, students] = await this.studentPermissionService.getAndValidateStudentsInRequesterClass(DBOperation.READ, null, context);

        if (permission === Permission.ALLOW && !students) {
            return this.usersPersistence.getUsersByFilters({role: UserRole.STUDENT});
        } else {
            return students;
        }
    }

    @Query('student')
    async getStudentById(_, args, context) {
        const [permission, students] = await this.studentPermissionService.getAndValidateStudentsInRequesterClass(DBOperation.READ, args.id, context);
        if (permission === Permission.ALLOW && !students) {
            return this.usersPersistence.getUserByFilters({role: UserRole.STUDENT}, args.id);
        } else {
            return students;
        }
    }

    @ResolveProperty('class')
    async getStudentClass(obj, {}, context) {
        this.studentPermissionService.validateObjClassMatchRequester(DBOperation.READ, obj, context);
        const objClassId = obj.class_id ? obj.class_id.toString() : '';
        return this.classPersistence.getById(objClassId);
    }

    @ResolveProperty('schedule')
    async getStudentSchedule(obj, {}, context) {
        this.studentPermissionService.validateObjClassMatchRequester(DBOperation.READ, obj, context);
        const [, response] = await this.usersPersistence.getStudentSchedule(obj);
        return response;
    }

    @Mutation('createStudent')
    async createStudent(_, { student }, context) {
        checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.STUDENT);
        // TODO: Handle errors!!!!
        if (ObjectID.isValid(student.class_id)) {
            student.class_id = new ObjectID(student.class_id);
        }
        const [, response] = await this.usersPersistence.createUser(student, UserRole.STUDENT);
        return response;
    }

    @Mutation('updateStudent')
    async updateStudent(_, { id, student }, context) {
        const [permission, students] = await this.studentPermissionService.getAndValidateStudentsInRequesterClass(DBOperation.UPDATE, id, context);
        if (!students) {
            this.logger.error(`updateUser:: error updating user ${id} - user not found`);
            return null;
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.updateUser(id, student, UserRole.STUDENT);
        return response;
    }

    @Mutation('deleteStudent')
    async deleteStudent(_, { id }, context) {
        const [permission, students] = await this.studentPermissionService.getAndValidateStudentsInRequesterClass(DBOperation.DELETE, id, context);
        if (!students) {
            this.logger.error(`deleteStudent:: error deleting user ${id} - user not found`);
            return null;
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
