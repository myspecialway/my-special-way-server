import * as envalid from 'envalid';

export interface ProcessEnvConfig {
    NODE_ENV: string;
    DB_CONNECTION_STRING: string;
    DB_NAME: string;
}

export function getEnvalidValidations(): { [K in keyof ProcessEnvConfig]: envalid.ValidatorSpec<ProcessEnvConfig[K]> } {
    return {
        NODE_ENV: envalid.str({ default: 'prod' }),
        DB_CONNECTION_STRING: envalid.str(),
        DB_NAME: envalid.str(),
    }
}