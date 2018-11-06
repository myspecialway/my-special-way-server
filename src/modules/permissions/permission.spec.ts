import {PermissionFactory} from './permission-factory';
import {UserRole} from '../../models/user.db.model';
import {Asset, checkAndGetBasePermission, DBOperation, Permission} from './permission.interface';

describe('permission factory and strategies', () => {

    it('should create principle strategy and return allow permission', () => {
        const permission = PermissionFactory.get({role: UserRole.PRINCIPLE}).getPermission(null, null);
        expect(permission).toEqual(Permission.ALLOW);
    });

    it('should create teacher strategy and return own, allow and forbid permission', () => {
        const permissionStrategy = PermissionFactory.get({role: UserRole.TEACHER});
        let permission = permissionStrategy.getPermission(Asset.STUDENT, DBOperation.READ);
        expect(permission).toEqual(Permission.OWN);

        permission = permissionStrategy.getPermission(Asset.STUDENT, DBOperation.CREATE);
        expect(permission).toEqual(Permission.FORBID);

        permission = permissionStrategy.getPermission(Asset.USER, DBOperation.CREATE);
        expect(permission).toEqual(Permission.FORBID);
    });
    // TODO: uncomment when implementing student permissions.
    // it('should create student strategy and return forbid permission', () => {
    //     const permission = PermissionFactory.get({role: UserRole.STUDENT}).getPermission(null, null);
    //     expect(permission).toEqual(Permission.FORBID);
    // });

    it('should create student strategy and return OWN permission', () => {
        const permission = PermissionFactory.get({role: UserRole.STUDENT}).getPermission(Asset.STUDENT, DBOperation.READ);
        expect(permission).toEqual(Permission.OWN);
    });

    it('should create no strategy and return forbid permission\'', () => {
        const permission = PermissionFactory.get({}).getPermission(null, null);
        expect(permission).toEqual(Permission.FORBID);
    });

    it('should not create a strategy and raise excpeiotn on forbid permission', () => {
        let err: boolean  = false;
        try {
            const permission = checkAndGetBasePermission(null, DBOperation.UPDATE, Asset.STUDENT);
        } catch (e) {
            err = true;
        }
        expect(err).toBeTruthy();
    });

    it('should create no strategy and return allow permission\'', () => {
        const permission = checkAndGetBasePermission({role: UserRole.PRINCIPLE}, DBOperation.UPDATE, Asset.STUDENT);
        expect(permission).toEqual(Permission.ALLOW);
    });

    it('should create strategy and raise exception on forbid permission', () => {
        let err: boolean  = false;
        try {
            const permission = checkAndGetBasePermission({role: UserRole.STUDENT}, DBOperation.DELETE, Asset.STUDENT);
        } catch (e) {
            err = true;
        }
        expect(err).toBeTruthy();
    });
}
