import { Resolver, Query, Mutation, ResolveProperty } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UserRole } from '../../../models/user.db.model';

@Resolver('Student')
export class StudentResolver {
    constructor(private usersPersistence: UsersPersistenceService, private classPersistence: ClassPersistenceService) { }

    @Query('students')
    async getStudents(_, {}, context) {
        return this.usersPersistence.getUsersByFilters({role: UserRole.STUDENT});
    }

    @Query('student')
    async getStudentById(_, args, context) {
        return this.usersPersistence.getUserByFilters({role: UserRole.STUDENT}, args.id);
    }

    @ResolveProperty('class')
    async getStudentClass(obj, {}, context) {
        return this.classPersistence.getById(obj.class_id);
    }

    @Mutation('createStudent')
    async createStudent(_, { student }, context) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.createUser(student, UserRole.STUDENT);
        return response;
    }

    @Mutation('updateStudent')
    async updateStudent(_, { id, student }, context) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.updateUser(id, student, UserRole.STUDENT);
        return response;
    }

    @Mutation('deleteStudent')
    async deleteStudent(_, { id }, context) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
