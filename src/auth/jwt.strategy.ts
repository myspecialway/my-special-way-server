import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, HttpException, LoggerService } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET, AuthService } from './auth-service/auth.service';
import { UserCridentials } from 'models/user-cridentials.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: UserCridentials, done: (ex: HttpException, object) => void) {
        const user = await this.authService.validateUserByCridentials(payload);

        if (!user) {
            done(new UnauthorizedException(), false);
            return;
        }

        done(null, user);
    }
}
