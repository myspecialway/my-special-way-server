import {UserDbModel, UserRole} from '../../../models/user.db.model';
import {UserTokenProfile} from '../../../models/user-token-profile.model';
import {UserLoginRequest} from '../../../models/user-login-request.model';
import {Injectable} from '@nestjs/common';
import {AuthServiceInterface} from '../../auth/auth-service/auth.service.interface';

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

export const TEACHER_PERMISSION_RULES: PermissionRule[] = [
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

export class PermissionFactory {
    get(user: UserTokenProfile) : Permissions {
        switch (user.role) {
            case UserRole.PRINCIPLE:
                return new PrinciplePermission();
            case UserRole.TEACHER:
                return new TeacherPermission();
            case UserRole.STUDENT:
                return new StudentPermission();
        }
    }
}

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

export function getPermission(asset: Asset, op: DBOperation, user: UserTokenProfile): Permission {
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

export function checkAndGetBasePermission(user: object | UserTokenProfile | undefined, op: DBOperation, asset: Asset): Permission {
    if (!user) {
        return Permission.FORBID;
    }
    PermissionFactory.get(user)
    return getPermission(asset, op, user as UserTokenProfile);
}
