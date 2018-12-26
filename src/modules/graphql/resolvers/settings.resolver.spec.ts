import { SettingsResolver } from './settings.resolver';
import { SettingsPersistenceService } from './../../persistence/settings.persistence.service';

describe('settings resolver', () => {
  const MOCK_SETTINGS = {
    teachercode: 1345,
  };
  let settingsResolver: SettingsResolver;
  let settingsPersistence: Partial<SettingsPersistenceService>;

  beforeEach(() => {
    settingsPersistence = {
      getAll: jest.fn(),
      updateSettings: jest.fn(),
    };
    settingsResolver = new SettingsResolver(settingsPersistence as SettingsPersistenceService);
  });
  it('should call getAll function and return settings for on getSettings', async () => {
    (settingsPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ teachercode: 1345 }]));
    const response = await settingsResolver.getSettings(null, {}, MOCK_SETTINGS);
    expect(response).toEqual([{ teachercode: 1345 }]);
    expect(settingsPersistence.getAll).toHaveBeenCalled();
  });

  it('should call updateUser function and return the settings updated', async () => {
    (settingsPersistence.updateSettings as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_SETTINGS]));
    const response = await settingsResolver.updateSettings(
      null,
      { id: 'someid', settings: MOCK_SETTINGS },
      MOCK_SETTINGS,
    );
    expect(response).toEqual(MOCK_SETTINGS);
    expect(settingsPersistence.updateSettings).toHaveBeenCalledWith('someid', MOCK_SETTINGS);
  });
});
