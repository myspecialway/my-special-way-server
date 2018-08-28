import {PermissionFactory} from './permission_factory';
import {UserRole} from '../../models/user.db.model';
import {NoPermission, PrinciplePermission, StudentPermission, TeacherPermission} from './permission.strategy';

describe('student resolver', () => {

    it('should create principle strategy', () => {
        const permission = PermissionFactory.get({role: UserRole.PRINCIPLE});
        expect(permission).toEqual(PrinciplePermission);
    });

    it('should create teacher strategy', () => {
        const permission = PermissionFactory.get({role: UserRole.TEACHER});
        expect(permission).toEqual(TeacherPermission);
    });

    it('should create student strategy', () => {
        const permission = PermissionFactory.get({role: UserRole.STUDENT});
        expect(permission).toEqual(StudentPermission);
    });

    it('should create no strategy', () => {
        const permission = PermissionFactory.get({});
        expect(permission).toEqual(NoPermission);
    });
}
