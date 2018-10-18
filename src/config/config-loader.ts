import * as envalid from 'envalid';
import { ProcessEnvConfig, getEnvalidValidations } from './config-interface';

export function getConfig() {
        return envalid.cleanEnv<ProcessEnvConfig>(process.env, getEnvalidValidations());
    }
