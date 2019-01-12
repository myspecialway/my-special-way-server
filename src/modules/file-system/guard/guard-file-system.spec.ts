import { AuthService } from '../../auth/auth-service/auth.service';
import { UserRole } from '../../../models/user.db.model';
import { ExecutionContext } from '@nestjs/common';
import { mockReq } from '../../../../test/express-mock/express-mock';
import { AuthFileGuard } from './guard-file-system';

describe('file-system guard', () => {
  let context: Partial<ExecutionContext>;
  const authGuard = new AuthFileGuard();
  AuthService.getUserProfileFromToken = jest.fn();
  (AuthService.getUserProfileFromToken as jest.Mock).mockImplementation((auth) => {
    switch (auth) {
      case 'header_for_PRINCIPLE':
        return { role: UserRole.PRINCIPLE };
      case 'header_for_TEACHER':
        return { role: UserRole.TEACHER };
      case 'header_for_STUDENT':
        return { role: UserRole.STUDENT };
      default:
        return null;
    }
  });

  it('guard miss headers', async () => {
    const request = mockReq();
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    };
    const isPass = authGuard.canActivate(context as ExecutionContext);
    expect(isPass).toBeFalsy();
  });

  it('guard pass for PRINCIPLE headers', async () => {
    const request = mockReq({
      headers: {
        authorization: 'header_for_PRINCIPLE',
      },
    });
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    };
    const isPass = authGuard.canActivate(context as ExecutionContext);
    expect(isPass).toBeTruthy();
  });

  it('guard falid for TEACHER headers', async () => {
    const request = mockReq({
      headers: {
        authorization: 'header_for_TEACHER',
      },
    });
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    };
    const isPass = authGuard.canActivate(context as ExecutionContext);
    expect(isPass).toBeFalsy();
  });

  it('guard falid for STUDENT headers', async () => {
    const request = mockReq({
      headers: {
        authorization: 'header_for_STUDENT',
      },
    });
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    };
    const isPass = authGuard.canActivate(context as ExecutionContext);
    expect(isPass).toBeFalsy();
  });
});
