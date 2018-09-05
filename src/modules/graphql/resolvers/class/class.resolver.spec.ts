import { ClassResolver } from './class.resolver';
import { ClassLogic } from './services/class-logic.service';
import { ClassPersistenceService } from '../../../persistence/class.persistence.service';
import { UsersPersistenceService } from '../../../persistence/users.persistence.service';
import { Permission } from '../../../permissions/permission.interface';
import * as permInt from '../../../permissions/permission.interface';

describe('class resolver', () => {
    const MOCK_PRINCIPLE = {
        id: 'test_principle_id',
        username: 'test_username',
        email: 'email@test.co.il',
        firstname: 'test_firstname',
        lastname: 'test_lastname',
        class_id: 'test_classid',
        role: 'PRINCIPLE',
    };
    const MOCK_PRINCIPLE_CONTEXT = {
        user: MOCK_PRINCIPLE,
    };

    const MOCK_TEACHER = {
        id: 'test_teahcer_id',
        username: 'test_username',
        email: 'email@test.co.il',
        firstname: 'test_firstname',
        lastname: 'test_lastname',
        class_id: 'test_classid',
        role: 'TEACHER',
    };
    const MOCK_TEACHER_CONTEXT = {
        user: MOCK_TEACHER,
    };

    let classResolver: ClassResolver;
    let classPersistence: Partial<ClassPersistenceService>;
    let usersPersistence: Partial<UsersPersistenceService>;
    let classLogic: Partial<ClassLogic>;
    beforeEach(() => {
        classPersistence = {
            getAll: jest.fn(),
            getById: jest.fn(),
            getByName: jest.fn(),
            createClass: jest.fn(),
            updateClass: jest.fn(),
            deleteClass: jest.fn(),
        };
        usersPersistence = {
            getStudentsByClassId: jest.fn(),
            getById: jest.fn(),
        };

        classLogic = {
            buildDefaultSchedule: jest.fn().mockReturnValue([null, []]),
        }

        classResolver = new ClassResolver(
            classPersistence as ClassPersistenceService,
            usersPersistence as UsersPersistenceService,
            classLogic as ClassLogic,
        );
    });

    it('should call getAll function and return classes for on classes', async () => {
        (classPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ name: 'test' }]));

        const response = await classResolver.getClasses(null, null, MOCK_PRINCIPLE_CONTEXT, null);
        expect(response).toEqual([{ name: 'test' }]);
        expect(classPersistence.getAll).toHaveBeenCalled();
    });

    it('should call getAll and getById function and return classes for on classes', async () => {
        (classPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ name: 'test_class_name', _id: 'test_classid' }]));
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test', _id: 'someid', class_id: 'test_classid' }));

        const response = await classResolver.getClasses(null, null, MOCK_TEACHER_CONTEXT, null);
        expect(response).toEqual([{ name: 'test_class_name', _id: 'test_classid' }]);
        expect(usersPersistence.getById).toHaveBeenCalled();
        expect(classPersistence.getAll).toHaveBeenCalled();
    });

    it('should call getById function and return class on getClassById', async () => {
        (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test' }));

        const response = await classResolver.getClassById(null, { id: 'someid' }, MOCK_PRINCIPLE_CONTEXT, null);
        expect(response).toEqual({ name: 'test' });
        expect(classPersistence.getById).toHaveBeenCalledWith('someid');
    });

    it('should call getById function and return class on getClassById for teacher', async () => {
        (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ _id: 'test_classid', name: 'test' }));
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test', _id: 'someid', class_id: 'test_classid' }));

        const response = await classResolver.getClassById(null, { id: 'someid' }, MOCK_TEACHER_CONTEXT, null);
        expect(response).toEqual({ _id: 'test_classid', name: 'test' });
        expect(classPersistence.getById).toHaveBeenCalledWith('someid');
        expect(usersPersistence.getById).toHaveBeenCalled();
    });

    it('should call getByName function and return class on getClassByName', async () => {
        (classPersistence.getByName as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test' }));
        const response = await classResolver.getClassByName(null, { name: 'somename' }, MOCK_PRINCIPLE_CONTEXT, null);
        expect(classPersistence.getByName).toHaveBeenCalledWith('somename');
    });

    it('should call getByName function and return class on getClassByName for teacher', async () => {
        (classPersistence.getByName as jest.Mock).mockReturnValue(Promise.resolve({ _id: 'test_classid', name: 'test' }));
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test', _id: 'someid', class_id: 'test_classid' }));

        const response = await classResolver.getClassByName(null, { name: 'somename' }, MOCK_TEACHER_CONTEXT, null);
        expect(response).toEqual({ _id: 'test_classid', name: 'test' });
        expect(classPersistence.getByName).toHaveBeenCalledWith('somename');
        expect(usersPersistence.getById).toHaveBeenCalled();
    });

    // fit('should call getStudentsByClassId and return students users', async () => {
    //     const expected = { username: 'student2', role: 'STUDENT' };
    //     (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve(expected));
    //     const [error, response] = await classResolver.getStudentsByClassId({ _id: 'someid' }, null, MOCK_PRINCIPLE_CONTEXT);
    //     expect(response).toEqual(expected);
    //     expect(usersPersistence.getStudentsByClassId).toHaveBeenCalledWith('someid');
    // });

    it('should call createClass and return new created class', async () => {
        const expected = { name: 'טיטאן', level: 'א', number: 1, grade: 'a' };
        (classPersistence.createClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await classResolver.createClass(null, { class: expected }, MOCK_PRINCIPLE_CONTEXT);
        expect(result).toEqual(expected);
        expect(classPersistence.createClass).toHaveBeenCalledWith(expected);
    });

    it('should return error if wrong grade was received', async () => {
        const classLogicMock = classLogic.buildDefaultSchedule as jest.Mock;
        classLogicMock.mockReset();
        classLogicMock.mockReturnValue([new Error(), []]);

        const newClassMock = { name: 'טיטאן', level: 'א', number: 1, grade: 'a' };
        const result = await classResolver.createClass(null, { class: newClassMock }, MOCK_PRINCIPLE_CONTEXT);
        expect(result).toEqual(new Error());
    });

    it('should call updateClass and return updated class', async () => {
        const expected = { name: 'טיטאן', level: 'א', number: 1 };
        (classPersistence.updateClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await classResolver.updateClass(null, { id: '5b217b030825622c97d3757f', class: expected }, MOCK_PRINCIPLE_CONTEXT);
        expect(result).toEqual(expected);
        expect(classPersistence.updateClass).toHaveBeenLastCalledWith('5b217b030825622c97d3757f', expected);
    });

    it('should call updateClass and return updated class for teacer', async () => {
        const expected = { name: 'טיטאן', level: 'א', number: 1 };
        (classPersistence.updateClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test', _id: 'someid', class_id: 'test_classid' }));

        const result = await classResolver.updateClass(null, { id: 'test_classid', class: expected }, MOCK_TEACHER_CONTEXT);
        expect(result).toEqual(expected);
        expect(classPersistence.updateClass).toHaveBeenLastCalledWith('test_classid', expected);
        expect(usersPersistence.getById).toHaveBeenCalled();
    });

    it('should call updateClass to throw exception', async () => {
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test', _id: 'someid', class_id: 'test_classid' }));
        // Async / Await expect().toThrow() does not work - so implemented with try/catch
        let err = false;
        try {
            await classResolver.updateClass(null, { id: 'othe_classid', class: {} }, MOCK_TEACHER_CONTEXT);
        } catch (e) {
            err = true;
        }
        expect(err).toBeTruthy();
    });

    it('should call deleteClass and return the number of class deleted', async () => {
        (classPersistence.deleteClass as jest.Mock).mockReturnValue(Promise.resolve(1));
        const result = await classResolver.deleteClass(null, { id: '5b217b030825622c97d3757f' }, MOCK_PRINCIPLE_CONTEXT);
        expect(result).toEqual(1);
        expect(classPersistence.deleteClass).toHaveBeenCalledWith('5b217b030825622c97d3757f');
    });

    it('should call deleteClass and raise exception for "no permission for teacher"', async () => {
        // Async / Await expect().toThrow() does not work - so implemented with try/catch
        let err = false;
        try {
            await classResolver.deleteClass(null, { id: 'test_classid' }, MOCK_TEACHER_CONTEXT);
        } catch (e) {
            err = true;
        }
        expect(err).toBeTruthy();
    });

    it('should call deleteClass and raise exception for as itsnot the teachers class"', async () => {
        permInt.checkAndGetBasePermission = jest.fn(() => Permission.OWN); // tslint:disable-line
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test', _id: 'someid', class_id: 'test_classid' }));
        // Async / Await expect().toThrow() does not work - so implemented with try/catch
        let err = false;
        try {
            await classResolver.deleteClass(null, { id: 'other_classid' }, MOCK_TEACHER_CONTEXT);
        } catch (e) {
            err = true;
        }
        expect(err).toBeTruthy();
        expect(usersPersistence.getById).toHaveBeenCalled();
    });

    it('should call deleteClass and return the number of class deleted for teacher"', async () => {
        (classPersistence.deleteClass as jest.Mock).mockReturnValue(Promise.resolve(1));
        (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test', _id: 'someid', class_id: 'test_classid' }));
        permInt.checkAndGetBasePermission = jest.fn(() => Permission.OWN); // tslint:disable-line

        const result = await classResolver.deleteClass(null, { id: 'test_classid' }, MOCK_TEACHER_CONTEXT);
        expect(result).toEqual(1);
        expect(classPersistence.deleteClass).toHaveBeenCalledWith('test_classid');
    });

    it('should call getClassSchedule and return the obj schedule', () => {
        const schedule = classResolver.getClassSchedule({ name: 'someclass', schedule: [{ index: '00' }] }, {}, MOCK_PRINCIPLE_CONTEXT);
        expect(schedule[0]).toEqual({ index: '00' });
    });

    it('should call getClassSchedule and return empty array when there\'s no schedule', () => {
        const schedule = classResolver.getClassSchedule({ name: 'someclass', schedule: [{ index: '00' }] }, {}, MOCK_PRINCIPLE_CONTEXT);
        expect(schedule[0]).toEqual({ index: '00' });
    });

    it('should call getClassSchedule and return empty array when there\'s no schedule', () => {
        const schedule = classResolver.getClassSchedule({ name: 'someclass' }, {}, MOCK_PRINCIPLE_CONTEXT);
        expect(schedule).toHaveLength(0);
    });

});
