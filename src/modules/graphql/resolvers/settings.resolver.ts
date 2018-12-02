import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { SettingsPersistenceService } from '../../persistence/settings.persistence.service';

@Resolver('Settings')
export class SettingsResolver {
  constructor(private settingsPersistence: SettingsPersistenceService) {}

  @Query('settings')
  async getSettings(_, {}, context) {
    return this.settingsPersistence.getAll();
  }

  @Mutation('updateSettings')
  async updateSettings(_, { id, settings }, context) {
    const [, response] = await this.settingsPersistence.updateSettings(id, settings);
    return response;
  }
}
