import { LabelsPersistenceService } from './../../persistence/labels.persistence.service';
import { Resolver, Query } from '@nestjs/graphql';

@Resolver('Label')
export class LabelsResolver {
  constructor(private labelsPersistence: LabelsPersistenceService) { }

  @Query('labels')
  async getLabels(_, { }, context) {
    return this.labelsPersistence.getAll();
  }

  @Query('labelsByType')
  async getLabelsByType(obj, args, context) {
    return await this.labelsPersistence.getByType(args.type);
  }

}
