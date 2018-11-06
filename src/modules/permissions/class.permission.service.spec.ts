import { UsersPersistenceService } from '../persistence/users.persistence.service';
import { DBOperation } from './permission.interface';
import { ClassPermissionService } from './class.permission.service';

describe('class permission service', () => {
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

    let classPermissionService: ClassPermissionService;
    let usersPersistence: Partial<UsersPersistenceService>;
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
            getStudentSchedule: jest.fn(),
        };

        classPermissionService = new ClassPermissionService(usersPersistence as UsersPersistenceService);
    });

    it('should call getById function and return students on validateObjClassMatchRequester', async () => {
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({class_id: '123'}));

        await classPermissionService.validateObjClassMatchRequester(DBOperation.READ, '123', MOCK_TEACHER_CONTEXT);
        expect(usersPersistence.getById).toHaveBeenCalled();
    });

    it('should call getById function and throw exception on validateObjClassMatchRequester with different class_id', async () => {
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({class_id: '234'}));

        let err = false;
        try {
            await classPermissionService.validateObjClassMatchRequester(DBOperation.READ, '123', MOCK_TEACHER_CONTEXT);
        } catch  (e) {
            err = true;
        }
        expect(usersPersistence.getById).toHaveBeenCalled();
        expect(err).toBeTruthy();
    });

    it('should call getById function and return class on getAndValidateClassOfRequster for teacher', async () => {
        const expected = {_id: 'classId', name: 'className', grade: 'firstGrade'};
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({class_id: 'classId'}));

        const response = await classPermissionService.getAndValidateClassOfRequster(expected, MOCK_TEACHER_CONTEXT);
        expect(response).toEqual(expected);
    });

    it('should call getById function and return null on getAndValidateClassOfRequster for teacher', async () => {
        const expected = {_id: 'classId', name: 'className', grade: 'firstGrade'};
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({class_id: '234'}));

        const response = await classPermissionService.getAndValidateClassOfRequster(expected, MOCK_TEACHER_CONTEXT);
        expect(response).toBeNull();
    });

    it('should call getById function and return class on getAndValidateClassOfRequster for principle', async () => {
        const expected = {_id: 'classId', name: 'className', grade: 'firstGrade'};
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({class_id: 'classId'}));

        const response = await classPermissionService.getAndValidateClassOfRequster(expected, MOCK_PRINCIPLE_CONTEXT);
        expect(response).toEqual(expected);
    });
});
