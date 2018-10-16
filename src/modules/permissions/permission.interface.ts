import {UserRole} from '../../models/user.db.model';
import {UserTokenProfile} from '../../models/user-token-profile.model';
import {PermissionFactory} from './permission-factory';

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
    ANY = 'ANY',
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

export const  TEACHER_PERMISSION_RULES: PermissionRule[] = [
    // Asset.STUDENT
    {operation: DBOperation.CREATE, asset: Asset.STUDENT, role: UserRole.TEACHER, permission: Permission.FORBID},
    {operation: DBOperation.READ, asset: Asset.STUDENT, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.UPDATE, asset: Asset.STUDENT, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.DELETE, asset: Asset.STUDENT, role: UserRole.TEACHER, permission: Permission.FORBID},
    // Asset.LESSON
    {operation: DBOperation.CREATE, asset: Asset.LESSON, role: UserRole.TEACHER, permission: Permission.FORBID},
    {operation: DBOperation.READ, asset: Asset.LESSON, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.UPDATE, asset: Asset.LESSON, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.DELETE, asset: Asset.LESSON, role: UserRole.TEACHER, permission: Permission.FORBID},
    // Asset.CLASS
    {operation: DBOperation.CREATE, asset: Asset.CLASS, role: UserRole.TEACHER, permission: Permission.FORBID},
    {operation: DBOperation.READ, asset: Asset.CLASS, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.UPDATE, asset: Asset.CLASS, role: UserRole.TEACHER, permission: Permission.OWN},
    {operation: DBOperation.DELETE, asset: Asset.CLASS, role: UserRole.TEACHER, permission: Permission.FORBID},
];

export interface Permissions {
    getPermission(asset: Asset, op: DBOperation): Permission;
}

export function checkAndGetBasePermission(user: object | UserTokenProfile | undefined, op: DBOperation, asset: Asset): Permission {
    let permission: Permission = Permission.FORBID;
    if (user) {
        permission = PermissionFactory.get(user).getPermission(asset, op);
    }
    if (permission === Permission.FORBID) {
        throw new Error(NO_PERMISSION);
    }
    return permission;
}
