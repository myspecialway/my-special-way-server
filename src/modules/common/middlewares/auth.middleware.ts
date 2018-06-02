'use strict';

import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

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
