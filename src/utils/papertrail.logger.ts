import { LoggerService, Logger } from '@nestjs/common';
import * as winston from 'winston';
import { Papertrail } from 'winston-papertrail';
// import { getConfig } from '../config/config-loader';

export class PaperTrailLogger extends Logger implements LoggerService {

    constructor(context?: string, isTimeDiffEnabled?: boolean) {
        super(context, isTimeDiffEnabled);
        // if (getConfig().isProd) {
        //     this.transportList.push(this.winstonPapertrail);
         }

        // winstonPapertrail = new Papertrail({
        //     host: 'logs7.papertrailapp.com',
        //     port: 32979,
        // });
        logger = winston.createLogger({
            level: 'info',
            format: winston.format.prettyPrint(),
            transports: [
                new winston.transports.File({ filename: 'combined.log' }),
                new winston.transports.Console(),
            ],
        });
        log(message: string) {
            this.logger.info(message);
            super.log(message);
        }
        error(message: string, trace: string) {
            this.logger.error(message);
            super.error(message, trace);
        }
        warn(message: string) {
            this.logger.warn(message);
            super.warn(message);
        }

    }
