import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { UserTokenProfile} from '../../../models/user-token-profile.model';
import { AuthServiceInterface } from './auth.service.interface';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { UserDbModel } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';

export const JWT_SECRET = '3678ee53-5207-4124-bc58-fef9d48d12b1';
export const JWT_PAYLOAD = 'payload';

@Injectable()
export class AuthService implements AuthServiceInterface {
    private logger = new Logger('AuthService');
    constructor(private userPersistanceService: UsersPersistenceService) { }

    /* istanbul ignore next */
    async createTokenFromCridentials(userLogin: UserLoginRequest): Promise<[Error, string]> {
        this.logger.log(`createTokenFromCridentials:: validating cridentials for ${userLogin.username}`);
        const [error, user] = await this.validateUserByCridentials(userLogin);

        if (error) {
            this.logger.error(`createTokenFromCridentials:: error validating user ${userLogin.username}`, error.stack);
        }

        if (error || user === null) {
            this.logger.warn(`createTokenFromCridentials:: user ${userLogin.username} not found`);
            return [error, null];
        }

        const userCridentials: UserTokenProfile = {
            id: user._id,
            username: user.username,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            class_id: user.class_id,
        };

        return [null, jwt.sign(userCridentials, JWT_SECRET, {
            expiresIn: '2h',
        })];
    }

    /* istanbul ignore next */
    async validateUserByCridentials(userLogin: UserLoginRequest): Promise<[Error, UserDbModel]> {
        return await this.userPersistanceService.authenticateUser(userLogin);
    }

    /* istanbul ignore next */
    static getUserProfileFromToken(token: string): UserTokenProfile {
        let user: UserTokenProfile = {
            id: null,
            username: null,
            role: null,
            firstname: null,
            lastname: null,
            class_id: null,
        };
        if (token) {
            const jwttoken = jwt.decode(token.replace('Bearer ', ''), {json: true, complete: true}) ;
            user = jwttoken[JWT_PAYLOAD] as UserTokenProfile;
        }
        return user;
    }
}
