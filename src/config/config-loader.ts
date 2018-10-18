import * as envalid from 'envalid';
import { ProcessEnvConfig, getEnvalidValidations } from './config-interface';
import { Logger } from '@nestjs/common';
export function getConfig() {
    const logger = new Logger('getConfig');
    try {
        const conf =  envalid.cleanEnv<ProcessEnvConfig>(process.env, getEnvalidValidations());
        return conf;
    } catch (e) {
        logger.error('Config went wrong', e);
        return null;
    }

}
