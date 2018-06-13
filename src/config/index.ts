import { Config } from './environments/config.model';
import { config } from './environments/dev';

let _config: Config;
const env = process.env.NODE_ENV || 'dev';

if (!env) {
    throw new Error('NODE_ENV environment variable not found.');
}

try {
   // import _config = require(`./environments/${env}`);
   _config = config;
}
catch (e) {
    throw Error(`Error loading configuration file, ${e.message}`);
}

export const RunConfig = _config;