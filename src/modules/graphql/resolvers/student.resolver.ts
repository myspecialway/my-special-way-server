import { Resolver, Query, Mutation, ResolveProperty } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UserDbModel, UserRole} from '../../../models/user.db.model';
import { Asset, checkAndGetBasePermission, DBOperation, NO_PERMISSION, Permission} from '../../permissions/permission.interface';
import { Get } from '../../../utils/get';
import { StudentPermissionService } from '../../permissions/student.premission.service';

@Resolver('Student')
export class StudentResolver {
    constructor(private usersPersistence: UsersPersistenceService, 
        private classPersistence: ClassPersistenceService,
        private studentPermissionService: StudentPermissionService) { }

    @Query('students')
    async getStudents(_, {}, context) {
        const [permission, students] = await this.studentPermissionService.validateStudentsInRequesterClass(DBOperation.READ, null, context);
        
        if (permission === Permission.ALLOW && !students) {
            return this.usersPersistence.getUsersByFilters({role: UserRole.STUDENT});
        } else {
            return students;
        }
    }

    @Query('student')
    async getStudentById(_, args, context) {
        const [permission, students] = await this.studentPermissionService.validateStudentsInRequesterClass(DBOperation.READ, args.id, context);
        if (permission === Permission.ALLOW && !students) {
            return this.usersPersistence.getUserByFilters({role: UserRole.STUDENT}, args.id);
        } else {
            return students;
        }
    }

    @ResolveProperty('class')
    async getStudentClass(obj, {}, context) {
        this.studentPermissionService.validateObjClassMatchRequester(obj,context);
        const objClassId = obj.class_id ? obj.class_id.toString() : '';
        return this.classPersistence.getById(objClassId);
    }

    @ResolveProperty('schedule')
    async getStudentSchedule(obj, {}, context) {
        this.studentPermissionService.validateObjClassMatchRequester(obj,context);
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
        this.studentPermissionService.validateStudentsInRequesterClass(DBOperation.UPDATE, id, context);
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.updateUser(id, student, UserRole.STUDENT);
        return response;
    }

    @Mutation('deleteStudent')
    async deleteStudent(_, { id }, context) {
        this.studentPermissionService.validateStudentsInRequesterClass(DBOperation.DELETE, id, context);
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
