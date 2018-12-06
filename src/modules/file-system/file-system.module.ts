import { Module } from '@nestjs/common';
import { FileSystemController } from './file-system-controller/file-system.controller';
import { PersistenceModule } from '../persistence/persistence.module';
@Module({
  imports: [PersistenceModule],
  providers: [],
  controllers: [FileSystemController],
})
export class FileSystemModule {}
