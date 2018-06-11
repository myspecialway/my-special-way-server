import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { UserTokenProfile } from '../../../models/user-token-profile.model';
import { AuthServiceInterface } from './auth.service.interface';
import { UsersPersistenceService } from '../../persistence/users.persistence';
import { UserDbModel, UserRole } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';

export const JWT_SECRET = '3678ee53-5207-4124-bc58-fef9d48d12b1';

@Injectable()
export class AuthService implements AuthServiceInterface {
    constructor(private userPersistanceService: UsersPersistenceService) { }

    /* istanbul ignore next */
    async createTokenFromCridentials(userLogin: UserLoginRequest): Promise<[Error, string]> {
        const [error, user] = await this.validateUserByCridentials(userLogin);
        if (error || user === null) {
            return [error, null];
        }

        const userCridentials: UserTokenProfile = {
            username: user.username,
            role: user.role,
            expiresAt: moment().add(2, 'hours').format(),
        };

        return [null, jwt.sign(userCridentials, JWT_SECRET)];
    }

    /* istanbul ignore next */
    async validateUserByCridentials(userLogin: UserLoginRequest): Promise<[Error, UserDbModel]> {
        return await this.userPersistanceService.authenticateUser(userLogin);
    }
}