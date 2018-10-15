import { LessonResolver } from './lesson.resolver';
import { LessonPersistenceService } from '../../persistence/lesson.persistence.service';

describe('lesson resolver', () => {
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
    let lessonResolver: LessonResolver;
    let lessonPersistence: Partial<LessonPersistenceService>;
    beforeEach(() => {
        lessonPersistence = {
            getAll: jest.fn(),
            createLesson: jest.fn(),
            updateLesson: jest.fn(),
            deleteLesson: jest.fn(),
        };

        lessonResolver = new LessonResolver(lessonPersistence as LessonPersistenceService);
    });

    it('should call getAll function and return lesson for on lesson', async () => {
        const expected = [{ title: 'mylesson', icon: 'myicon' }];
        (lessonPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve(expected));

        const response = await lessonResolver.getLessons(MOCK_CONTEXT);
        expect(response).toEqual(expected);
        expect(lessonPersistence.getAll).toHaveBeenCalled();
    });

    it('should call createLesson and return new created lesson', async () => {
        const expected = [{ title: 'mylesson', icon: 'myicon' }];
        (lessonPersistence.createLesson as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await lessonResolver.createLesson({lesson: expected}, MOCK_CONTEXT);
        expect(result).toEqual(expected);
        expect(lessonPersistence.createLesson).toHaveBeenCalledWith(expected);
    });

    it('should call updateLesson and return updated lesson', async () => {
        const expected = [{ title: 'mylesson', icon: 'myicon' }];
        (lessonPersistence.updateLesson as jest.Mock).mockReturnValue(Promise.resolve(expected));
        const result = await lessonResolver.updateLesson({id: '5b217b030825622c97d3757f', lesson: expected}, MOCK_CONTEXT);
        expect(result).toEqual(expected);
        expect(lessonPersistence.updateLesson).toHaveBeenLastCalledWith('5b217b030825622c97d3757f', expected);
    });

    it('should call deleteLesson and return the number of lessons deleted', async () => {
        (lessonPersistence.deleteLesson as jest.Mock).mockReturnValue(Promise.resolve(1));
        const result = await lessonResolver.deleteLesson({id: '5b217b030825622c97d3757f'}, MOCK_CONTEXT);
        expect(result).toEqual(1);
        expect(lessonPersistence.deleteLesson).toHaveBeenCalledWith('5b217b030825622c97d3757f');
    });

});
