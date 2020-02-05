import * as envalid from 'envalid';

export interface ProcessEnvConfig {
  NODE_ENV: string;
  DB_CONNECTION_STRING: string;
  DB_NAME: string;
  PAPERTRAIL_HOST_PORT: string;
  BASE_URL: string;
  EXPIRATION_FIRST_TOKEN_MINUTES: string;
  EMAIL_CLIENT_USERNAME: string;
  EMAIL_CLIENT_PASSWORD: string;
}

export function getEnvalidValidations(): { [K in keyof ProcessEnvConfig]: envalid.ValidatorSpec<ProcessEnvConfig[K]> } {
  return {
    NODE_ENV: envalid.str({ default: 'production' }),
    DB_CONNECTION_STRING: envalid.str(),
    DB_NAME: envalid.str({ default: 'msw-dev' }),
    PAPERTRAIL_HOST_PORT: envalid.str({ default: 'logs7.papertrailapp.com:32979' }),
    BASE_URL: envalid.str({ default: 'http://mswppr.tel-aviv.gov.il' }),
    EXPIRATION_FIRST_TOKEN_MINUTES: envalid.str({ default: '15' }),
    EMAIL_CLIENT_USERNAME: envalid.str({ default: 'username'}),
    EMAIL_CLIENT_PASSWORD: envalid.str({ default: 'password'}),
  };
}
