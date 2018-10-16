import { ClassLogic } from './class-logic.service';

describe('ClassLogic', () => {
    let classLogic: ClassLogic;

    beforeEach(() => {
        classLogic = new ClassLogic();
    });

    it('should return an error if wrong grade has been received', () => {
        const [error, schedule] = classLogic.buildDefaultSchedule('aa');

        expect(error).toBeDefined();
        expect(schedule.length).toBe(0);
    });

    it('should return schedule for valid elementary input', () => {
        const [error, schedule] = classLogic.buildDefaultSchedule('a');

        expect(error).toBeNull();
        expect(schedule).toBeDefined();
    });

    it('should return schedule for valid junior input', () => {
        const [error, schedule] = classLogic.buildDefaultSchedule('f');

        expect(error).toBeNull();
        expect(schedule).toBeDefined();
    });
});
