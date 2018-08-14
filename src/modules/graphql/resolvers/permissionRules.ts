import { UserRole} from '../../../models/user.db.model';
import { UserTokenProfile } from '../../../models/user-token-profile.model';

export const NO_PERMISSION = 'not permissions to execute command';

export enum DBOperation {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    ANY = 'ANY',
}

export enum Asset {
    STUDENT = 'STUDENT',
    CLASS = 'CLASS',
    LESSON = 'LESSON',
    MAP = 'MAP',
    USER = 'USER',
    ANY = 'ANY'
}

export enum Permission {
    ALLOW = 'ALLOW',
    FORBID = 'FORBID',
    OWN = 'OWN',
}

export interface PermissionRule {
    operation: DBOperation;
    asset: Asset;
    role: UserRole;
    permission: Permission;
}

export const TEACHER_PERMISSION_RULES: PermissionRule[] = [
    {operation: DBOperation.CREATE, asset: Asset.STUDENT, role: UserRole.TEACHER, permission: Permission.FORBID},
    {operation: DBOperation.READ, asset: Asset.STUDENT, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.UPDATE, asset: Asset.STUDENT, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.DELETE, asset: Asset.STUDENT, role: UserRole.TEACHER, permission: Permission.FORBID},
    {operation: DBOperation.CREATE, asset: Asset.LESSON, role: UserRole.TEACHER, permission: Permission.FORBID},
    {operation: DBOperation.READ, asset: Asset.LESSON, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.UPDATE, asset: Asset.LESSON, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.DELETE, asset: Asset.LESSON, role: UserRole.TEACHER, permission: Permission.FORBID},
];

export class Permissions {

    static getPermission(asset: Asset, op: DBOperation, user: UserTokenProfile): Permission {
        if (user.role === UserRole.PRINCIPLE) {
            return Permission.ALLOW;
        }
        if (user.role === UserRole.STUDENT) {
            return Permission.FORBID;
        }
        if (user.role === UserRole.TEACHER) {
            const rule = TEACHER_PERMISSION_RULES.find((obj) => obj.operation === op && obj.asset === asset);
            if (!rule) {
                return Permission.ALLOW;
            } else {
                return rule.permission;
            }
        }
    }

    static checkAndGetBasePermission(user: UserTokenProfile, op: DBOperation, asset: Asset): Permission {
        if (!user) {
            return Permission.FORBID;
        }
        return Permissions.getPermission(asset, op, user);
    }

}
