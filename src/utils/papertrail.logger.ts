import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { Papertrail } from 'winston-papertrail';
// import { getConfig } from '../config/config-loader';

export class PaperTrailLogger implements LoggerService {

    constructor() {
        // if (getConfig().isProd) {
        //     this.transportList.push(this.winstonPapertrail);
         }

        winstonPapertrail = new Papertrail({
            host: 'logs7.papertrailapp.com',
            port: 32979,
        });
        logger = winston.createLogger({
            level: 'info',
            format: winston.format.simple(),
            transports: [
                new winston.transports.Console(),
            ],
        });
        log(message: string) {
            this.logger.info(message);
        }
        error(message: string, trace: string) {
            this.logger.error(message);
        }
        warn(message: string) {
            this.logger.warn(message);
        }

    }
