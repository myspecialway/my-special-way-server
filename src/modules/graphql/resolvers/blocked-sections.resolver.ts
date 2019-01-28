import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { BlockedSectionsPersistenceService } from '../../persistence/blocked-sections.persistence.service';

@Resolver('BlockedSections')
export class BlockedSectionsResolver {
  constructor(private blockedSectionsPersistence: BlockedSectionsPersistenceService) {}

  @Query('blockedSections')
  async getBlockedLocation() {
    return this.blockedSectionsPersistence.getAll();
  }

  @Query('blockedSectionsByLocations')
  async getblockedSectionsByLocations(obj, args, context, info) {
    return this.blockedSectionsPersistence.getBlockSectionsByLocation(args.locations);
  }

  @Mutation('createBlockedSection')
  async createBlockedSection(obj, { blockedSection }) {
    return this.blockedSectionsPersistence.createBlockedSection(blockedSection);
  }

  @Mutation('updateBlockedSection')
  async updateBlockedSection(obj, { id, blockedSection }) {
    return this.blockedSectionsPersistence.updateBlockedSection(id, blockedSection);
  }

  @Mutation('deleteBlockedSection')
  async deleteBlockedSection(obj, { id }) {
    return this.blockedSectionsPersistence.deleteBlockedSection(id);
  }
}
