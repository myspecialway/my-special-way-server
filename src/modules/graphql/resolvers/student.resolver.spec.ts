import { StudentResolver } from './student.resolver';
import { UsersPersistenceService } from '../../persistence';
import { UserRole } from '../../../models/user.db.model';

describe('student resolver', () => {
    const MOCK_STUDENT = {
        username: 'ah584d',
        email: 'email@test.co.il',
        firstname: 'avraham',
        lastname: 'hamu',
        gender: 'MALE',
    };
    let studentResolver: StudentResolver;
    let usersPersistence: Partial<UsersPersistenceService>;
    beforeEach(() => {
        usersPersistence = {
            getAll: jest.fn(),
            getById: jest.fn(),
            getUsersByFilters: jest.fn(),
            getUserByFilters: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
        };

        studentResolver = new StudentResolver(usersPersistence as UsersPersistenceService);
    });

    it('should call getUsersByFilters function and return students on getStudents', async () => {
        (usersPersistence.getUsersByFilters as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));

        const response = await studentResolver.getStudents();
        expect(response).toEqual([{ username: 'test' }]);
        expect(usersPersistence.getUsersByFilters).toHaveBeenCalled();
    });

    it('should call getUserByFilters function and return student on getStudentById', async () => {
        (usersPersistence.getUserByFilters as jest.Mock).mockReturnValue(Promise.resolve({ username: 'test' }));

        const response = await studentResolver.getStudentById(null, { id: 'someid' }, null, null);
        expect(response).toEqual({ username: 'test' });
        expect(usersPersistence.getUserByFilters).toHaveBeenCalledWith({role: UserRole.STUDENT}, 'someid');
    });

    it('should call createUser function and return the new student created', async () => {
        (usersPersistence.createUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_STUDENT]));

        const response = await studentResolver.createStudent(null, {student: MOCK_STUDENT});
        expect(response).toEqual(MOCK_STUDENT);
        expect(usersPersistence.createUser).toHaveBeenCalledWith(MOCK_STUDENT, UserRole.STUDENT);
    });

    it('should call updateUser function and return the student updated', async () => {
        (usersPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_STUDENT]));

        const response = await studentResolver.updateStudent(null, { id: 'someid', student: MOCK_STUDENT});
        expect(response).toEqual(MOCK_STUDENT);
        expect(usersPersistence.updateUser).toHaveBeenCalledWith('someid', MOCK_STUDENT, UserRole.STUDENT);
    });

    it('should call deleteUser function and return the number of students deleted', async () => {

        (usersPersistence.deleteUser as jest.Mock).mockReturnValue(Promise.resolve([null, 1]));

        const response = await studentResolver.deleteStudent(null, { id: 'someid' });
        expect(response).toEqual(1);
        expect(usersPersistence.deleteUser).toHaveBeenCalledWith('someid');
    });
});