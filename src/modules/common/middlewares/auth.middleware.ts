'use strict';

import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    public resolve() {
        return async (req: Request, res: Response, next: NextFunction) => {
            next();
        };
    }
}
