import { ClassResolver } from './class.resover';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';

describe('class resolver', () => {
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
            getClassStudents: jest.fn(),
        };

        classResolver = new ClassResolver(classPersistence as ClassPersistenceService, usersPersistence as UsersPersistenceService);
    });

    it('should call getAll function and return classes for on classes', async () => {
        (classPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ name: 'test' }]));

        const response = await classResolver.getClasses(null, null, null, null);
        expect(response).toEqual([{ name: 'test' }]);
        expect(classPersistence.getAll).toHaveBeenCalled();
    });

    it('should call getById function and return class on getClassById', async () => {
        (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test' }));

        const response = await classResolver.getClassById(null, { id: 'someid' }, null, null);
        expect(response).toEqual({ name: 'test' });
        expect(classPersistence.getById).toHaveBeenCalledWith('someid');
    });

    it('should call getByName function and return class on getClassByName', async () => {
        (classPersistence.getByName as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test' }));
        const response = await classResolver.getClassByName(null, { name: 'somename' }, null, null);
        expect(response).toEqual({ name: 'test'});
        expect(classPersistence.getByName).toHaveBeenCalledWith('somename');
    });

    it('should call getClassStudents and return students users', async () => {
        const expected = [{ username: 'student1', role: 'STUDENT' }, { username: 'student2', role: 'STUDENT' }];
        (usersPersistence.getClassStudents as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const response = await classResolver.getClassStudents({_id: 'someid'}, null, null);
        expect(response).toEqual(expected);
        expect(usersPersistence.getClassStudents).toHaveBeenCalledWith('someid');
    });

    it('should call createClass and return new created class', async () => {
        const expected = { name: 'טיטאן', level : 'א', number : 1 };
        (classPersistence.createClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await classResolver.createClass(null, {class: expected});
        expect(result).toEqual(expected);
        expect(classPersistence.createClass).toHaveBeenCalledWith(expected);
    });

    it('should call updateClass and return updated class', async () => {
        const expected = { name: 'טיטאן', level : 'א', number : 1 };
        (classPersistence.updateClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await classResolver.updateClass(null, {id: '5b217b030825622c97d3757f', class: expected});
        expect(result).toEqual(expected);
        expect(classPersistence.updateClass).toHaveBeenLastCalledWith('5b217b030825622c97d3757f', expected);
    });

    it('should call deleteClass and return the number of class deleted', async () => {
        (classPersistence.deleteClass as jest.Mock).mockReturnValue(Promise.resolve(1));
        const result = await classResolver.deleteClass(null, {id: '5b217b030825622c97d3757f'});
        expect(result).toEqual(1);
        expect(classPersistence.deleteClass).toHaveBeenCalledWith('5b217b030825622c97d3757f');
    });

});