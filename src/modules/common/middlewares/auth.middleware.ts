'use strict';
/* istanbul ignore next */
import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

/* istanbul ignore next */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    public resolve() {
        return async (req: Request, res: Response, next: NextFunction) => {
            // passport.initialize();
            // passport.authenticate('jwt', { session: false });
            next();
        };
    }
}
