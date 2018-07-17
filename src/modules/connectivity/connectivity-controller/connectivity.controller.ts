import { Response } from 'express';
import { Controller, Get, Res } from '@nestjs/common';
import { ConnectivityService } from '../connectivity-service/connectivity.service';

@Controller()
export class ConnectivityController {
    constructor(private readonly connectivityService: ConnectivityService) { }

    @Get('/readiness')
    async readiness(@Res() res: Response): Promise<void> {
        const validate = await this.connectivityService.validateDBConnection();

        if (!validate) {
            res.status(500).json({
                message: 'db connection error',
            });
            return;
        }
        res.json({
            message: 'db connection is valid',
        });
    }
}
