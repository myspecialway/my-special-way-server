import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { UserRole } from '../../../models/user.db.model';

@Resolver('Student')
export class StudentResolver {
    constructor(private usersPersistence: UsersPersistenceService) { }

    @Query('students')
    public async getStudents() {
        return this.usersPersistence.getUsersByFilters({role: UserRole.STUDENT});
    }

    @Query('student')
    public async getStudentById(obj, args, context, info) {
        return this.usersPersistence.getUserByFilters({role: UserRole.STUDENT}, args.id);
    }

    // @Mutation('createStudent')
    // public async createStudent(_, { user }) {
    //     // TODO: Handle errors!!!!
    //     const [__, response] = await this.usersPersistence.createUser(user);
    //     return response;
    // }

    // @Mutation('updateStudent')
    // public async updateStudent(_, { id, user }) {
    //     // TODO: Handle errors!!!!
    //     const [__, response] = await this.usersPersistence.updateUser(id, user);
    //     return response;
    // }

    // @Mutation('deleteStudent')
    // public async deleteStudent(_, { id }) {
    //     // TODO: Handle errors!!!!
    //     const [__, response] = await this.usersPersistence.deleteUser(id);
    //     return response;
    // }
}