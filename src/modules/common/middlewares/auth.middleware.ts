'use strict';

import { Middleware, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Middleware()
export class AuthMiddleware implements NestMiddleware {
    public resolve() {
        return async (req: Request, res: Response, next: NextFunction) => {
            next();
        };
    }
}
