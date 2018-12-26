'use strict';

import SettingsDbModel from '@models/settings.db.model';

export interface ISettingsPersistenceService {
  readonly getAll: () => Promise<SettingsDbModel[]>;

  // CRUD on settings
  updateSettings: (id: string, settingsObj: SettingsDbModel) => Promise<[Error, SettingsDbModel]>;
}
