import * as moment from 'moment';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, HttpException, LoggerService, InternalServerErrorException, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET, AuthService } from './auth-service/auth.service';
import { UserTokenProfile } from 'models/user-token-profile.model';
import { UsersPersistenceService } from '../persistence/users.persistence';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger('JwtStrategy');

    constructor(private readonly userService: UsersPersistenceService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: UserTokenProfile, done: (ex: HttpException, object) => void) {
        this.logger.log(`validate:: validating user ${payload.username}`);
        const expiryDiff = moment(payload.expiresAt).diff(moment());
        if (expiryDiff < 0) {
            this.logger.warn(`user ${payload.username} token is expired, ${expiryDiff}`);
            done(new UnauthorizedException('token expired'), null);
            return;
        }

        const [error, user] = await this.userService.getByUsername(payload.username);

        if (error) {
            this.logger.error('validate:: user validation error', error.stack);
            done(new InternalServerErrorException(), null);
            return;
        }

        // TODO: Do I need this?
        if (!user) {
            this.logger.warn(`validation:: usern ${payload.username} was not found`);
            done(new UnauthorizedException(), false);
            return;
        }

        this.logger.log(`validate:: validation success for user ${payload.username}`);
        done(null, user);
    }
}
