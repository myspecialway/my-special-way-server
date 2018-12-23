import { BlockedSectionsResolver } from './blocked-sections.resolver';
import { BlockedSectionsPersistenceService } from '../../persistence/blocked-sections.persistence.service';
import BlockedSectionsDbModel from '../../../models/blocked-sections.db.model';
describe('BlockedSectionsResolver', () => {
  const MOCK_BLOCKED_SECTIONS: BlockedSectionsDbModel[] = [
    {
      _id: '1',
      from: 'A',
      to: 'B',
      reason: 'some reason',
    },
    {
      _id: '2',
      from: 'C',
      to: 'D',
      reason: 'some reason2',
    },
  ];
  let blockedSectionsResolver: BlockedSectionsResolver;
  let blockedSectionsPersistence: Partial<BlockedSectionsPersistenceService>;

  beforeEach(() => {
    blockedSectionsPersistence = {
      getAll: jest.fn(),
      getById: jest.fn(),
      createBlockedSection: jest.fn(),
      deleteBlockedSection: jest.fn(),
    };
    blockedSectionsResolver = new BlockedSectionsResolver(
      blockedSectionsPersistence as BlockedSectionsPersistenceService,
    );
  });

  it('should call getAll function and return blocked locations on blockedSections', async () => {
    (blockedSectionsPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve(MOCK_BLOCKED_SECTIONS));

    const response = await blockedSectionsResolver.getBlockedLocation();
    expect(response).toEqual(MOCK_BLOCKED_SECTIONS);
    expect(blockedSectionsPersistence.getAll).toHaveBeenCalled();
  });

  it('should call createBlockedSection and return new created blocked section', async () => {
    const expected = { from: 'A0', to: 'B0', reason: 'some reason3' };
    (blockedSectionsPersistence.createBlockedSection as jest.Mock).mockReturnValue(Promise.resolve(expected));
    const result = await blockedSectionsResolver.createBlockedSection(null, { blockedSection: expected });
    expect(result).toEqual(expected);
    expect(blockedSectionsPersistence.createBlockedSection).toHaveBeenCalledWith(expected);
  });

  it('should call deleteBlockedSection and return the number of deleted blocked sections', async () => {
    (blockedSectionsPersistence.deleteBlockedSection as jest.Mock).mockReturnValue(Promise.resolve(1));
    const result = await blockedSectionsResolver.deleteBlockedSection(null, { id: '2' });
    expect(result).toEqual(1);
    expect(blockedSectionsPersistence.deleteBlockedSection).toHaveBeenCalledWith('2');
  });
});
