import { StudentResolver } from './student.resolver';
import { ClassPersistenceService } from '../../persistence';

describe('student resolver', () => {
    let studentResolver: StudentResolver;
    let classPersistence: Partial<ClassPersistenceService>;

    beforeEach(() => {
        classPersistence = {
            getById: jest.fn(),
        };
        studentResolver = new StudentResolver(classPersistence as ClassPersistenceService);
    });

    it('should call getStudentClass and return the requested class', async () => {
        const expected = { name: 'someclassname' };
        (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await studentResolver.getStudentClass({class_id: 'someclassid'}, null, null);
        expect(result).toEqual(expected);
        expect(classPersistence.getById).toHaveBeenCalledWith('someclassid');
    });

});
