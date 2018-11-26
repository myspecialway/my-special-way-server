import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { BlockedSectionsPersistenceService } from '../../persistence/blocked-sections.persistence.service';

@Resolver('BlockedSections')
export class BlockedSectionsResolver {
  constructor(private blockedSectionsPersistence: BlockedSectionsPersistenceService) {}

  @Query('blockedSections')
  async getBlockedLocation() {
    return this.blockedSectionsPersistence.getAll();
  }

  @Mutation('createBlockedSection')
  async createBlockedSection(obj, { blockedSection }) {
    return this.blockedSectionsPersistence.createBlockedSection(blockedSection);
  }

  @Mutation('deleteBlockedSection')
  async deleteBlockedSection(obj, { id }) {
    return this.blockedSectionsPersistence.deleteBlockedSection(id);
  }
}
