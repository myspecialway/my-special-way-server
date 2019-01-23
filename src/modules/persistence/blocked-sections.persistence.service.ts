import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import BlockedSectionsDbModel from 'models/blocked-sections.db.model';
// TODO: add interface?

@Injectable()
export class BlockedSectionsPersistenceService {
  private collection: Collection<BlockedSectionsDbModel>;
  private logger = new Logger('BlockedSectionsPersistenceService');

  constructor(private dbService: DbService) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<BlockedSectionsDbModel>('blocked_sections');
  }

  async getBlockSectionsByLocation(locations: string[]): Promise<BlockedSectionsDbModel[]> {
    try {
      this.logger.log('getAll:: fetching blocked_sections');

      const blocksections = await this.collection
        .find({
          $or: [{ from: { $in: locations } }, { to: { $in: locations } }],
        })
        .toArray();
      return blocksections;
    } catch (error) {
      this.logger.error('getAll:: error fetching blocked_sections', error.stack);
      throw error;
    }
  }
  async deleteBlockSectionsByLocation(location: string) {
    const blockSections: BlockedSectionsDbModel[] = await this.getBlockSectionsByLocation([location]);
    const blockSectionIds = this.getBlockSectionsIds(blockSections);
    const result = await this.collection.deleteMany({ _id: { $in: blockSectionIds } });
    return result;
  }
  private getBlockSectionsIds(blockSections: BlockedSectionsDbModel[]) {
    return blockSections.map((blockSection) => {
      return blockSection._id;
    });
  }

  async getAll(): Promise<BlockedSectionsDbModel[]> {
    try {
      this.logger.log('getAll:: fetching blocked_sections');
      return await this.collection.find({}).toArray();
    } catch (error) {
      this.logger.error('getAll:: error fetching blocked_sections', error.stack);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`getAll:: fetching blockedSection by id ${id}`);
      return await this.collection.findOne({ _id: mongoId });
    } catch (error) {
      this.logger.error(`getAll:: error blockedSection by id ${id}`, error.stack);
      throw error;
    }
  }
  async createBlockedSection(blockedSection: BlockedSectionsDbModel): Promise<BlockedSectionsDbModel> {
    try {
      this.logger.log(`BlockedSectionsPersistenceService::createBlockedSection:: create blockedSection`);
      const blocksections = await this.collection
        .find({
          $or: [
            {
              $and: [{ from: blockedSection.from }, { to: blockedSection.to }],
            },
            {
              $and: [{ from: blockedSection.to }, { to: blockedSection.from }],
            },
          ],
        })
        .toArray();
      if (blocksections.length) {
        throw new BadRequestException('bloock section is exist');
      }
      const insertResponse = await this.collection.insertOne(blockedSection);
      return await this.getById(insertResponse.insertedId.toString());
    } catch (error) {
      this.logger.error(
        'BlockedSectionsPersistenceService::createBlockedSection:: error creating blockedSection',
        error.stack,
      );
      throw error;
    }
  }

  async updateBlockedSection(id: string, blockedSection: BlockedSectionsDbModel): Promise<BlockedSectionsDbModel> {
    const mongoId = new ObjectID(id);
    try {
      this.logger.log(`BlockedSectionsPersistenceService::updateBlockedSection:: update blockedSection ${mongoId}`);
      const currentBlockedSection = await this.collection.findOne({ _id: mongoId });
      const updatedDocument = await this.collection.findOneAndUpdate(
        { _id: mongoId },
        { $set: { ...currentBlockedSection, ...blockedSection } },
        { returnOriginal: false },
      );
      this.logger.log(
        `BlockedSectionsPersistenceService::updateBlockedSection:: updated DB :${JSON.stringify(
          updatedDocument.value,
        )}`,
      );
      return updatedDocument.value;
    } catch (error) {
      this.logger.error(
        `BlockedSectionsPersistenceService::updateBlockedSection:: error updating blockedSection ${mongoId}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteBlockedSection(id: string): Promise<number> {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`BlockedSectionsPersistenceService::deleteBlockedSection:: deleting blockedSection by id ${id}`);
      const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
      this.logger.log(
        `BlockedSectionsPersistenceService::deleteBlockedSection:: removed ${deleteResponse.deletedCount} documents`,
      );
      return deleteResponse.deletedCount;
    } catch (error) {
      this.logger.error(
        `BlockedSectionsPersistenceService::deleteBlockedSection:: error deleting blockedSection by id ${id}`,
        error.stack,
      );
      throw error;
    }
  }
}
