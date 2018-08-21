import { ClassResolver } from './class.resolver';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';

describe('class resolver', () => {
    const MOCK_USER = {
        username: 'test_username',
        email: 'email@test.co.il',
        firstname: 'test_firstname',
        lastname: 'test_lastname',
        role: 'PRINCIPLE',
    };
    const MOCK_CONTEXT = {
        user:  MOCK_USER,
    };
    let classResolver: ClassResolver;
    let classPersistence: Partial<ClassPersistenceService>;
    let usersPersistence: Partial<UsersPersistenceService>;
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
        };

        classResolver = new ClassResolver(classPersistence as ClassPersistenceService, usersPersistence as UsersPersistenceService);
    });

    it('should call getAll function and return classes for on classes', async () => {
        (classPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ name: 'test' }]));

        const response = await classResolver.getClasses(null, null, MOCK_CONTEXT, null);
        expect(response).toEqual([{ name: 'test' }]);
        expect(classPersistence.getAll).toHaveBeenCalled();
    });

    it('should call getById function and return class on getClassById', async () => {
        (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test' }));

        const response = await classResolver.getClassById(null, { id: 'someid' }, MOCK_CONTEXT, null);
        expect(response).toEqual({ name: 'test' });
        expect(classPersistence.getById).toHaveBeenCalledWith('someid');
    });

    it('should call getByName function and return class on getClassByName', async () => {
        (classPersistence.getByName as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test' }));
        const response = await classResolver.getClassByName(null, { name: 'somename' }, MOCK_CONTEXT, null);
        expect(response).toEqual({ name: 'test'});
        expect(classPersistence.getByName).toHaveBeenCalledWith('somename');
    });

    it('should call getStudentsByClassId and return students users', async () => {
        const expected = [{ username: 'student1', role: 'STUDENT' }, { username: 'student2', role: 'STUDENT' }];
        (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const response = await classResolver.getStudentsByClassId({_id: 'someid'}, null, MOCK_CONTEXT);
        expect(response).toEqual(expected);
        expect(usersPersistence.getStudentsByClassId).toHaveBeenCalledWith('someid');
    });

    it('should call createClass and return new created class', async () => {
        const expected = { name: 'טיטאן', level : 'א', number : 1 };
        (classPersistence.createClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await classResolver.createClass(null, {class: expected}, MOCK_CONTEXT);
        expect(result).toEqual(expected);
        expect(classPersistence.createClass).toHaveBeenCalledWith(expected);
    });

    it('should call updateClass and return updated class', async () => {
        const expected = { name: 'טיטאן', level : 'א', number : 1 };
        (classPersistence.updateClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await classResolver.updateClass(null, {id: '5b217b030825622c97d3757f', class: expected}, MOCK_CONTEXT);
        expect(result).toEqual(expected);
        expect(classPersistence.updateClass).toHaveBeenLastCalledWith('5b217b030825622c97d3757f', expected);
    });

    it('should call deleteClass and return the number of class deleted', async () => {
        (classPersistence.deleteClass as jest.Mock).mockReturnValue(Promise.resolve(1));
        const result = await classResolver.deleteClass(null, {id: '5b217b030825622c97d3757f'}, MOCK_CONTEXT);
        expect(result).toEqual(1);
        expect(classPersistence.deleteClass).toHaveBeenCalledWith('5b217b030825622c97d3757f');
    });

    it('should call getClassSchedule and return the obj schedule', () => {
        const schedule = classResolver.getClassSchedule({name: 'someclass', schedule: [{index: '00'}]}, {}, MOCK_CONTEXT );
        expect(schedule[0]).toEqual({index: '00'});
    });

    it('should call getClassSchedule and return empty array when there\'s no schedule', () => {
        const schedule = classResolver.getClassSchedule({name: 'someclass' }, {}, MOCK_CONTEXT);
        expect(schedule).toHaveLength(0);
    });

});
