import * as envalid from 'envalid';
import { ProcessEnvConfig, getEnvalidValidations } from './config-interface';

export function getConfig() {
    try {
    const conf =  envalid.cleanEnv<ProcessEnvConfig>(process.env, getEnvalidValidations());
    return conf;
    } catch (e) {
        console.log(e);
        return null;
    }

}
