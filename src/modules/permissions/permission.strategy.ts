import {Injectable} from '@nestjs/common';
import {Asset, DBOperation, Permission, Permissions, TEACHER_PERMISSION_RULES} from './permission.interface';

@Injectable()
export class PrinciplePermission implements Permissions {
    getPermission(asset: Asset, op: DBOperation): Permission {
        return Permission.ALLOW;
    }
}

@Injectable()
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

@Injectable()
export class StudentPermission implements Permissions {
    getPermission(asset: Asset, op: DBOperation): Permission {
        return Permission.FORBID;
    }
}

@Injectable()
export class NoPermission implements Permissions {
    getPermission(asset: Asset, op: DBOperation): Permission {
        return Permission.FORBID;
    }
}
