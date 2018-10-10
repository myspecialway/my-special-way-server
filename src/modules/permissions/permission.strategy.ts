import {Asset, DBOperation, Permission, Permissions, TEACHER_PERMISSION_RULES} from './permission.interface';
import { Logger } from '@nestjs/common';

const logger = new Logger('PermissionStrategy');

export class PrinciplePermission implements Permissions {
    getPermission(asset: Asset, op: DBOperation): Permission {
        return Permission.ALLOW;
    }
}

export class TeacherPermission implements Permissions {
    getPermission(asset: Asset, op: DBOperation): Permission {
        const rule = TEACHER_PERMISSION_RULES.find((obj) => obj.operation === op && obj.asset === asset);
        if (!rule) {
            return Permission.ALLOW;
        } else {
            return rule.permission;
        }
    }
}

export class StudentPermission implements Permissions {
    getPermission(asset: Asset, op: DBOperation): Permission {
      logger.error(
        '***********************Temporary fix - allowing student to get schedule.' +
        'implement student permissions!!! this is for demo only. ****************************************',
      );
      return Permission.ALLOW;
    }
}

export class NoPermission implements Permissions {
    getPermission(asset: Asset, op: DBOperation): Permission {
        return Permission.FORBID;
    }
}
