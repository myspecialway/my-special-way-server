import { Module, ValidationPipe } from '@nestjs/common';
import { FileSystemController } from './file-system-controller/file-system.controller';
import { PersistenceModule } from '../persistence/persistence.module';
import { FileUtilesService } from './services/file-utiles';
import { AuthFileGuard } from './guard/guard-file-system';
@Module({
  imports: [PersistenceModule],
  providers: [ValidationPipe, AuthFileGuard, FileUtilesService],
  controllers: [FileSystemController],
})
export class FileSystemModule {}
