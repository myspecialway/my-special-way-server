import {Module} from '@nestjs/common';
import {ClassPermissionService} from './class.permission.service';
import {StudentPermissionService} from './student.premission.service';
import {PersistenceModule} from '../persistence/persistence.module';

@Module({
    imports: [
        PersistenceModule,
    ],
    providers: [
        ClassPermissionService,
        StudentPermissionService,
    ],
    exports: [
        ClassPermissionService,
        StudentPermissionService,
    ],
})
export class PermissionsModule {
}
