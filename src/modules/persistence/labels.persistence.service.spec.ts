import { LabelType } from './../../models/label.db.model';
import { LabelsPersistenceService } from './labels.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';

describe('lesson persistence', () => {
    const collectioName = 'labels';
    let labelsPersistenceService: LabelsPersistenceService;
    let dbServiceMock: Partial<DbService>;

    beforeEach(() => {
        dbServiceMock = {
            getConnection: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn(),
                } as Partial<Collection>),
            } as Partial<Db>),
        };

        labelsPersistenceService = new LabelsPersistenceService(dbServiceMock as DbService);
    });

    it('should get all labels successfuly on getAll', async () => {
        const expected = [{ text: 'label1', type: LabelType.CLASS_HOURS }, { text: 'label2', type: LabelType.CLASS_HOURS }];
        (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockReturnValueOnce({
            toArray: jest.fn().mockReturnValueOnce(expected),
        });

        const result = await labelsPersistenceService.getAll();
        expect(result).toEqual(expected);
    });

    it('should throw an error on error through getAll function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await labelsPersistenceService.getAll().catch((error) => expect(error).not.toBeUndefined());
    });

    it('should get labels by type successfuly on getByType', async () => {
        const expected = [{ text: 'label1', type: LabelType.CLASS_HOURS }, { text: 'label2', type: LabelType.CLASS_HOURS }];
        (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockReturnValueOnce({
            sort: jest.fn().mockReturnValueOnce({
                toArray: jest.fn().mockReturnValueOnce(expected),
            }),
        });

        const result = await labelsPersistenceService.getByType(LabelType.CLASS_HOURS);
        expect(result).toEqual(expected);
    });

    it('should throw an error on error through getByType function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await labelsPersistenceService.getByType(LabelType.CLASS_HOURS).catch((error) => expect(error).not.toBeUndefined());
    });
});
