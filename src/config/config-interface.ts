import * as envalid from 'envalid';
import { Address } from 'nodemailer/lib/mailer';

export interface ProcessEnvConfig {
    NODE_ENV: string;
    DB_CONNECTION_STRING: string;
    DB_NAME: string;
    FIREBASE_DB_URL: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
}

export function getEnvalidValidations(): { [K in keyof ProcessEnvConfig]: envalid.ValidatorSpec<ProcessEnvConfig[K]> } {
    return {
        NODE_ENV: envalid.str({ default: 'prod' }),
        DB_CONNECTION_STRING: envalid.str(),
        DB_NAME: envalid.str(),
        FIREBASE_DB_URL: envalid.url(),
        FIREBASE_PROJECT_ID: envalid.str(),
        FIREBASE_PRIVATE_KEY: envalid.str(),
        FIREBASE_CLIENT_EMAIL: envalid.str(),
    };
}
