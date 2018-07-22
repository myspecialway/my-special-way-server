import * as path from 'path';
import * as fs from 'fs';
import * as envalid from 'envalid';
import { Logger } from '@nestjs/common';
import { ProcessEnvConfig } from './config-interface';

const logger = new Logger('Boostrap');
function validateEnvPresense() {
    const envFilepath = path.resolve(__dirname, '../../../.env');
    if (!fs.existsSync(envFilepath)) {
        logger.error('parseEnvFile:: .env not found, please create .env file with needed configurations');
        throw new Error('.env not found, please create .env file with needed configurations');
    }
}

export function getConfig() {
    return envalid.cleanEnv<ProcessEnvConfig>(process.env, {
        NODE_ENV: envalid.str({ default: 'local' }),
        DB_CONNECTION_STRING: envalid.str(),
        DB_NAME: envalid.str(),
    });
}
