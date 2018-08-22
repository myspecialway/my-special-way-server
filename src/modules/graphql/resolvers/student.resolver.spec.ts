import { StudentResolver } from './student.resolver';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UserRole } from '../../../models/user.db.model';
import { TimeSlotDbModel } from '../../../models/timeslot.db.model';

describe('student resolver', () => {
    const MOCK_STUDENT = {
        username: 'ah584d',
        email: 'email@test.co.il',
        firstname: 'avraham',
        lastname: 'hamu',
        gender: 'MALE',
        class_id: 'someclassid',
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
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            getStudentSchedule: jest.fn(),
        };
        classPersistence = {
            getById: jest.fn(),
        };

        studentResolver = new StudentResolver(usersPersistence as UsersPersistenceService, classPersistence as ClassPersistenceService);
    });

    it('should call getUsersByFilters function and return students on getStudents', async () => {
        (usersPersistence.getUsersByFilters as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));

        const response = await studentResolver.getStudents();
        expect(response).toEqual([{ username: 'test' }]);
        expect(usersPersistence.getUsersByFilters).toHaveBeenCalled();
    });

    it('should call getUserByFilters function and return student on getStudentById', async () => {
        (usersPersistence.getUserByFilters as jest.Mock).mockReturnValue(Promise.resolve({ username: 'test' }));

        const response = await studentResolver.getStudentById(null, { id: 'someid' });
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

    it('should call getStudentClass and return the class', async () => {
        (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'someclass' }));
        const response = await studentResolver.getStudentClass(MOCK_STUDENT);
        expect(response).toEqual({name: 'someclass'});
        expect(classPersistence.getById).toHaveBeenCalledWith('someclassid');
    });

    it('should call getStudentSchedule and return the merged schedule', async () => {
        const expected: TimeSlotDbModel[] = [
            {index: '00', lesson: {_id: 'someid', title: 'updatedlesson', icon: 'updatedicon'}},
            {index: '02', lesson: {_id: 'someid', title: 'somelesson', icon: 'someicon'}},
            {index: '01', lesson: {_id: 'someid', title: 'somelesson', icon: 'someicon'}},
        ];
        (usersPersistence.getStudentSchedule as jest.Mock).mockReturnValue(Promise.resolve([null, expected]));
        const response = await studentResolver.getStudentSchedule(MOCK_STUDENT);
        expect(response).toEqual(expected);
    });
});
