import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { UserRole } from '../../../models/user.db.model';

@Resolver('Student')
export class StudentResolver {
    constructor(private _usersPersistence: UsersPersistenceService) { }

    @Query('students')
    public async getStudents() {
        return this._usersPersistence.getUsersByFilters({role: UserRole.STUDENT});
    }

    @Query('student')
    public async getStudentById(obj, args, context, info) {
        return this._usersPersistence.getUserByFilters({role: UserRole.STUDENT}, args.id);
    }

    @Mutation('createStudent')
    public async createStudent(_, { student }) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.createUser(student, UserRole.STUDENT);
        return response;
    }

    @Mutation('updateStudent')
    public async updateStudent(_, { id, student }) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.updateUser(id, student, UserRole.STUDENT);
        return response;
    }

    @Mutation('deleteStudent')
    public async deleteStudent(_, { id }) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.deleteUser(id);
        return response;
    }
}