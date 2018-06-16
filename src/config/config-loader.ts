import * as path from 'path';
import { Config } from './environments/config.model';

let _config: Config;

export function initConfig() {
    const env = process.env.NODE_ENV;
    
    if (!process.env.NODE_ENV) {
        throw new Error('NODE_ENV environment variable not found - you must define it!');
    }

    try {
       _config = require(path.join(__dirname, `./environments/${env}`)).config;
    }
    catch (e) {
        throw Error(`Error loading configuration file, ${e.message}`);
    }
}

export function getConfig(){ return _config; }
