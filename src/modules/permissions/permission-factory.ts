import {UserTokenProfile} from '../../models/user-token-profile.model';
import {UserRole} from '../../models/user.db.model';
import {Get} from '../../utils/get';
import {Permissions} from './permission.interface';
import {NoPermission, PrinciplePermission, StudentPermission, TeacherPermission} from './permission.strategy';

export class PermissionFactory {
    private static principlePermission: PrinciplePermission = new PrinciplePermission();
    private static teacherPermission: TeacherPermission = new TeacherPermission();
    private static studentPermission: StudentPermission = new StudentPermission();
    private static noPermission: NoPermission = new NoPermission();

    static get(user: object | UserTokenProfile): Permissions {
        const role: UserRole | undefined = Get.getValue<UserRole>(user, 'role');
        switch (role) {
            case UserRole.PRINCIPLE:
                return PermissionFactory.principlePermission;
            case UserRole.TEACHER:
                return PermissionFactory.teacherPermission;
            case UserRole.STUDENT:
                return PermissionFactory.studentPermission;
            default:
                return  PermissionFactory.noPermission;
        }
    }
}
