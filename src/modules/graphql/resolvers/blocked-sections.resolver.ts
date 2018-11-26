import { Resolver, Query } from '@nestjs/graphql';
import { BlockedSectionsPersistenceService } from '../../persistence/blocked-sections.persistence.service';

@Resolver('BlockedSections')
export class BlockedSectionsResolver {
  constructor(private blockedSectionsPersistence: BlockedSectionsPersistenceService) {}

  @Query('blockedSections')
  async getBlockedLocation(obj, args, context) {
    return this.blockedSectionsPersistence.getAll();
  }
}
