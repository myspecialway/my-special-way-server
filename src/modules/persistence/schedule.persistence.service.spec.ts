import { ClassPersistenceService } from './class.persistence.service';
import { SchedulePersistenceService } from './schedule.persistence.service';
import { ObjectID } from 'bson';

describe('class persistence', () => {
  let classPersistenceService: ClassPersistenceService;
  let schedulePersistenceService: SchedulePersistenceService;
  beforeEach(() => {
    classPersistenceService = {
      getById: jest.fn().mockReturnValue({
        _id: '5bf4fd64a8c75f3080286e6b',
        name: 'className',
        grade: 'a',
        schedule: [
          {
            index: '5_0',
            hours: '10:30 - 11:15',
          },
          {
            index: '0_1',
            hours: '07:30 - 08:00',
          },
        ],
      }),
    };
    schedulePersistenceService = new SchedulePersistenceService(classPersistenceService);
  });

  it('should delete schedule successfully on deleteScheduleSlotFromClass', async () => {
    expect.hasAssertions();
    const classId: string = '5bf4fd64a8c75f3080286e6b';
    const classWithoutSchedule = {
      _id: '5bf4fd64a8c75f3080286e6b',
      name: 'className',
      grade: 'a',
      schedule: [
        {
          index: '5_0',
          hours: '10:30 - 11:15',
        },
      ],
    };
    const expectedMongoId = new ObjectID(classId);
    classPersistenceService.updateClassAsIs = jest.fn().mockReturnValue({value: classWithoutSchedule});

    const updatedClass = await schedulePersistenceService.deleteScheduleSlotFromClass(classId, '0_1');

    expect(classPersistenceService.updateClassAsIs).toBeCalledWith(expectedMongoId, classWithoutSchedule);
    expect(updatedClass).toEqual(classWithoutSchedule);
  });

  it('should return error on deleteScheduleSlotFromClass when error happened', async () => {
    expect.hasAssertions();
    classPersistenceService.updateClassAsIs = jest.fn(() => {
      throw new Error('mock error');
    });
    await schedulePersistenceService.deleteScheduleSlotFromClass('5bf4fd64a8c75f3080286e6b', 'abc').catch((error) => {
      expect(error).toBeDefined();
      expect(error.toString()).toContain('mock error');
    });
  });
});
