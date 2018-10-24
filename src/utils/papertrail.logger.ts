import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { Papertrail } from 'winston-papertrail';

export class MSWLogger implements LoggerService {
    /* istanbul ignore next */
    constructor(connectPaperTrail: boolean, paperTrailUrl: string) {
        if (connectPaperTrail) {
            const winstonPapertrail = new Papertrail({
                host: paperTrailUrl.split(':')[0],
                port: paperTrailUrl.split(':')[1],
            });
            this.pushToTransportList(winstonPapertrail);
            this.pushToTransportList(new winston.transports.Console());
        } else {
            this.pushToTransportList(new winston.transports.Console());
        }
        this.setLogger(winston.createLogger({
            level: 'info',
            format: winston.format.simple(),
            transports: this.transportList,
        }));
    }

    private transportList: Transport[] = [];
    private logger;
    private setLogger(logger: winston.Logger) {
        this.logger = logger;
    }
    /* istanbul ignore next */
    log(message: string) {
        this.logger.info(message);
    }
    /* istanbul ignore next */
    error(message: string, trace: string) {
        this.logger.error(message, trace);
    }
    /* istanbul ignore next */
    warn(message: string) {
        this.logger.warn(message);
    }
    /* istanbul ignore next */
    pushToTransportList(transport: Transport) {
        this.transportList.push(transport);
    }
    /* istanbul ignore next */
    getTransportList() {
        return this.transportList;
    }

}
