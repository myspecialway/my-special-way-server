import { LabelType } from './../../../models/label.db.model';
import { LabelsResolver } from './label.resolver';
import { LabelsPersistenceService } from './../../persistence/labels.persistence.service';

describe('label resolver', () => {
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
    let labelsResolver: LabelsResolver;
    let labelsPersistence: Partial<LabelsPersistenceService>;
    beforeEach(() => {
        labelsPersistence = {
            getAll: jest.fn(),
            getByType: jest.fn(),
        };

        labelsResolver = new LabelsResolver(labelsPersistence as LabelsPersistenceService);
    });

    it('should call getAll function and return all labels', async () => {
        const expected = [{ type: LabelType.CLASS_HOURS, text: 'label-text' }];
        (labelsPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve(expected));

        const response = await labelsResolver.getLabels(null, {}, MOCK_CONTEXT);
        expect(labelsPersistence.getAll).toHaveBeenCalled();
        expect(response).toEqual(expected);
    });

    it('should call getLabelsByType function and return all labels', async () => {
      const expected = [{ type: LabelType.CLASS_HOURS, text: 'label-text' }];
      (labelsPersistence.getByType as jest.Mock).mockReturnValue(Promise.resolve(expected));

      const response = await labelsResolver.getLabelsByType(null, { type: LabelType.CLASS_HOURS}, MOCK_CONTEXT);
      expect(labelsPersistence.getByType).toBeCalledWith(LabelType.CLASS_HOURS);
      expect(response).toEqual(expected);
  });
});
