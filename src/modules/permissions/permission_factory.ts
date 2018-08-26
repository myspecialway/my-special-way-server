import {UserTokenProfile} from '../../models/user-token-profile.model';
import {UserRole} from '../../models/user.db.model';
import {Get} from '../../utils/get';
import {Permissions} from './permission.interface';
import {NoPermission, PrinciplePermission, StudentPermission, TeacherPermission} from './permission.strategy';

export class PermissionFactory {
    static get(user: object | UserTokenProfile): Permissions {
        const role: UserRole | undefined = Get.getValue<UserRole>(user, 'role');
        switch (role) {
            case UserRole.PRINCIPLE:
                return new PrinciplePermission();
            case UserRole.TEACHER:
                return new TeacherPermission();
            case UserRole.STUDENT:
                return new StudentPermission();
            default:
                return new NoPermission();
        }
    }
}
