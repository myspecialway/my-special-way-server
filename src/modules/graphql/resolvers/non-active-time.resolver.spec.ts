import { NonActiveTimeResolver } from './non-active-time.resolver';
import { NonActiveTimePersistenceService } from '../../persistence/non-active-time.persistence.service';

describe('non active time resolver', () => {
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

  let nonActiveTimeResolver: NonActiveTimeResolver;
  let nonActiveTimePersistence: Partial<NonActiveTimePersistenceService>;
  beforeEach(() => {
    nonActiveTimePersistence = {
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    nonActiveTimeResolver = new NonActiveTimeResolver(nonActiveTimePersistence as NonActiveTimePersistenceService);
  });

  it('should call getAll function and return nonActiveTime', async () => {
    (nonActiveTimePersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ name: 'test' }]));

    const response = await nonActiveTimeResolver.getNonActiveTimes(null, {}, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual([{ name: 'test' }]);
    expect(nonActiveTimePersistence.getAll).toHaveBeenCalled();
  });

  it('should call createClass and throw error for non authorized teacher', async () => {
    (nonActiveTimePersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ name: 'test' }]));

    let err: boolean = false;
    try {
      await nonActiveTimeResolver.getNonActiveTimes(null, {}, MOCK_TEACHER_CONTEXT);
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
    expect(nonActiveTimePersistence.getAll).not.toHaveBeenCalled();
  });

  it('should call createNonActiveTime and return new created nonActiveTime', async () => {
    const expected = {
      title: 'best title ever',
      isAllDayEvent: false,
      startDateTime: 1234,
      endDateTime: 5678,
      isAllClassesEvent: false,
      classesIds: ['1', '2', '3'],
    };
    (nonActiveTimePersistence.create as jest.Mock).mockReturnValue(Promise.resolve(expected));

    const response = await nonActiveTimeResolver.createNonActiveTime(
      null,
      { nonActiveTime: expected },
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(response).toEqual(expected);
    expect(nonActiveTimePersistence.create).toHaveBeenCalledWith(expected);
  });

  it('should call createClass and throw error for non authorized teacher', async () => {
    const expected = {
      title: 'best title ever',
      isAllDayEvent: false,
      startDateTime: 1234,
      endDateTime: 5678,
      isAllClassesEvent: false,
      classesIds: ['1', '2', '3'],
    };
    (nonActiveTimePersistence.create as jest.Mock).mockReturnValue(Promise.resolve(expected));

    let err: boolean = false;
    try {
      await nonActiveTimeResolver.createNonActiveTime(null, { nonActiveTime: expected }, MOCK_TEACHER_CONTEXT);
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
    expect(nonActiveTimePersistence.create).not.toHaveBeenCalled();
  });

  it('should call updateNonActiveTime and return updated nonActiveTime', async () => {
    const expected = {
      title: 'best title ever',
      isAllDayEvent: false,
      startDateTime: 1234,
      endDateTime: 5678,
      isAllClassesEvent: false,
      classesIds: ['1', '2', '3'],
    };
    (nonActiveTimePersistence.update as jest.Mock).mockReturnValue(Promise.resolve(expected));

    const result = await nonActiveTimeResolver.updateNonActiveTime(
      null,
      { id: '5b217b030825622c97d3757f', nonActiveTime: expected },
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(result).toEqual(expected);
    expect(nonActiveTimePersistence.update).toHaveBeenLastCalledWith('5b217b030825622c97d3757f', expected);
  });

  it('should call updateNonActiveTime and throw error for non authorized teacher', async () => {
    const expected = {
      title: 'best title ever',
      isAllDayEvent: false,
      startDateTime: 1234,
      endDateTime: 5678,
      isAllClassesEvent: false,
      classesIds: ['1', '2', '3'],
    };
    (nonActiveTimePersistence.update as jest.Mock).mockReturnValue(Promise.resolve(expected));

    let err: boolean = false;
    try {
      await nonActiveTimeResolver.updateNonActiveTime(
        null,
        { id: 'test_id', nonActiveTime: expected },
        MOCK_TEACHER_CONTEXT,
      );
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
    expect(nonActiveTimePersistence.update).not.toHaveBeenCalled();
  });

  it('should call deleteNonActiveTime and return the number of object deleted', async () => {
    (nonActiveTimePersistence.delete as jest.Mock).mockReturnValue(Promise.resolve(1));

    const result = await nonActiveTimeResolver.deleteNonActiveTime(
      null,
      { id: '5b217b030825622c97d3757f' },
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(result).toEqual(1);
    expect(nonActiveTimePersistence.delete).toHaveBeenCalledWith('5b217b030825622c97d3757f');
  });

  it('should call deleteNonActiveTime and raise exception for "no permission for teacher"', async () => {
    let err = false;
    try {
      await nonActiveTimeResolver.deleteNonActiveTime(null, { id: 'test_id' }, MOCK_TEACHER_CONTEXT);
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
  });
});
