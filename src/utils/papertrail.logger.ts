import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { Papertrail } from 'winston-papertrail';
import { getConfig } from '../config/config-loader';

export class PaperTrailLogger implements LoggerService {
    transportList = [new winston.transports.Console()];
    constructor() {
        if (getConfig().isProd) {
            const winstonPapertrail = new Papertrail({
                host: getConfig().PAPERTRAIL_HOST_PORT.split(':')[0],
                port:  getConfig().PAPERTRAIL_HOST_PORT.split(':')[1],
            });
            this.transportList.push(winstonPapertrail);
         }}

        logger = winston.createLogger({
            level: 'info',
            format: winston.format.simple(),
            transports: this.transportList,
        });
        log(message: string) {
            this.logger.info(message);
        }
        error(message: string, trace: string) {
            this.logger.error(message, trace);
        }
        warn(message: string) {
            this.logger.warn(message);
        }

    }
