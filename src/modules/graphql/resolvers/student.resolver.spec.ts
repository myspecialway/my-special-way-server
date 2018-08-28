import { StudentResolver } from './student.resolver';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import {UserDbModel, UserRole} from '../../../models/user.db.model';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import {NO_PERMISSION} from '../../permissions/permission.interface';

describe('student resolver', () => {
    const MOCK_PRINCIPLE = {
        id: 'principle_1234',
        username: 'principle_ah584d',
        email: 'principle_email@test.co.il',
        firstname: 'principle_avraham',
        lastname: 'principle_hamu',
        gender: 'MALE',
        class_id: 'someclassid',
        role: 'PRINCIPLE',
    };
    const MOCK_PRINCIPLE_CONTEXT = {
        user:  MOCK_PRINCIPLE,
    };

    const MOCK_TEACHER = {
        id: 'teacher_1234',
        username: 'teacher_ah584d',
        email: 'teacher_email@test.co.il',
        firstname: 'teacher_avraham',
        lastname: 'teacher_hamu',
        gender: 'MALE',
        class_id: 'someclassid',
        role: 'TEACHER',
    };
    const MOCK_TEACHER_CONTEXT = {
        user:  MOCK_TEACHER,
    };

    const MOCK_STUDENT = {
        id: 'student_1234',
        username: 'student_ah584d',
        email: 'student_email@test.co.il',
        firstname: 'student_avraham',
        lastname: 'student_hamu',
        gender: 'MALE',
        class_id: 'someclassid',
        role: 'STUDNET',
    };
    const MOCK_STUDNET_CONTEXT = {
        user: MOCK_STUDENT,
    };

    let studentResolver: StudentResolver;
    let usersPersistence: Partial<UsersPersistenceService>;
    let classPersistence: Partial<ClassPersistenceService>;
    beforeEach(() => {
        usersPersistence = {
            getAll: jest.fn(),
            getById: jest.fn(),
            getUsersByFilters: jest.fn(),
            getUserByFilters: jest.fn(),
            getStudentsByClassId: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
        };
        classPersistence = {
            getById: jest.fn(),
        };

        studentResolver = new StudentResolver(usersPersistence as UsersPersistenceService, classPersistence as ClassPersistenceService);
    });

    it('should call getUsersByFilters function and return students on getStudents', async () => {
        (usersPersistence.getUsersByFilters as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));

        const response = await studentResolver.getStudents(null, {}, MOCK_PRINCIPLE_CONTEXT);
        expect(response).toEqual([{ username: 'test' }]);
        expect(usersPersistence.getUsersByFilters).toHaveBeenCalled();
    });

    it('should call getStudentsByClassId function and return students on getStudents', async () => {
        (usersPersistence.getUsersByFilters as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test-1' }]));
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({class_id: '123'}));
        (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));

        const response = await studentResolver.getStudents(null, {}, MOCK_TEACHER_CONTEXT);
        expect(response).toEqual([{ username: 'test' }]);
        expect(usersPersistence.getUsersByFilters).not.toHaveBeenCalled();
        expect(usersPersistence.getStudentsByClassId).toHaveBeenCalled();
    });

    it('should call getUserByFilters function and return student on getStudentById', async () => {
        (usersPersistence.getUserByFilters as jest.Mock).mockReturnValue(Promise.resolve({ username: 'test' }));

        const response = await studentResolver.getStudentById(null, { id: 'someid' }, MOCK_PRINCIPLE_CONTEXT);
        expect(response).toEqual({ username: 'test' });
        expect(usersPersistence.getUserByFilters).toHaveBeenCalledWith({role: UserRole.STUDENT}, 'someid');
    });

    it('should call getStudentsByClassId function and return student on getStudentById', async () => {
        (usersPersistence.getUserByFilters as jest.Mock).mockReturnValue(Promise.resolve({ username: 'test-1' }));
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({class_id: '123'}));
        (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve([, [{ username: 'test', _id: 'someid' }]]));

        const response = await studentResolver.getStudentById(null, { id: 'someid' }, MOCK_TEACHER_CONTEXT);
        expect(response).toEqual({ username: 'test', _id: 'someid' });
        expect(usersPersistence.getUsersByFilters).not.toHaveBeenCalled();
        expect(usersPersistence.getStudentsByClassId).toHaveBeenCalled();
        expect(usersPersistence.getUserByFilters).not.toHaveBeenCalled();
    });

    it('should call createUser function and return the new student created', async () => {
        (usersPersistence.createUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_PRINCIPLE]));

        const response = await studentResolver.createStudent(null, {student: MOCK_PRINCIPLE}, MOCK_PRINCIPLE_CONTEXT);
        expect(response).toEqual(MOCK_PRINCIPLE);
        expect(usersPersistence.createUser).toHaveBeenCalledWith(MOCK_PRINCIPLE, UserRole.STUDENT);
    });

    it('should call updateUser function as principle and return the student updated', async () => {
        (usersPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_PRINCIPLE]));

        const response = await studentResolver.updateStudent(null, { id: 'someid', student: MOCK_PRINCIPLE}, MOCK_PRINCIPLE_CONTEXT);
        expect(response).toEqual(MOCK_PRINCIPLE);
        expect(usersPersistence.updateUser).toHaveBeenCalledWith('someid', MOCK_PRINCIPLE, UserRole.STUDENT);
    });

    it('should call updateUser function as teacher and return the student was not updated', async () => {
        (usersPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_STUDENT]));
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({class_id: '123'}));
        (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve([, [{ username: 'test', _id: 'studentid' }]]));

        const response = await studentResolver.updateStudent(null, { id: 'studentid', student: MOCK_STUDENT}, MOCK_TEACHER_CONTEXT);
        expect(usersPersistence.updateUser).toHaveBeenCalledWith('studentid', MOCK_STUDENT, UserRole.STUDENT);
    });

    it('should call deleteUser function as principle and return the number of students deleted', async () => {

        (usersPersistence.deleteUser as jest.Mock).mockReturnValue(Promise.resolve([null, 1]));

        const response = await studentResolver.deleteStudent(null, { id: 'someid' }, MOCK_PRINCIPLE_CONTEXT);
        expect(response).toEqual(1);
        expect(usersPersistence.deleteUser).toHaveBeenCalledWith('someid');
    });

    it('should call getStudentClass and return the class', async () => {
        (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'someclass' }));
        const response = await studentResolver.getStudentClass(MOCK_PRINCIPLE, {}, MOCK_PRINCIPLE_CONTEXT);
        expect(response).toEqual({name: 'someclass'});
        expect(classPersistence.getById).toHaveBeenCalledWith('someclassid');
    });
});