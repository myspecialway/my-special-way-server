import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../modules/auth/auth-service/auth.service';
import { UserTokenProfile } from '@models/user-token-profile.model';
import { UserRole } from '../../../models/user.db.model';

@Injectable()
export class AuthFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request || !request.headers) {
      return false;
    }
    return this.checkPermission(request.headers);
  }

  private checkPermission(headers: any) {
    const token = headers.authorization;
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(token);
    if (userProfile === null || userProfile.role !== UserRole.PRINCIPLE) {
      return false;
    }
    return true;
  }
}
