import { ClassResolver } from '.';
import { ClassPersistenceService } from '../../persistence/';

describe('class resolver', () => {
    let classResolver: ClassResolver;
    let classPersistence: Partial<ClassPersistenceService>;
    beforeEach(() => {
        classPersistence = {
            getAll: jest.fn(),
            getById: jest.fn(),
            getByName: jest.fn(),
        };

        classResolver = new ClassResolver(classPersistence as ClassPersistenceService);
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
});