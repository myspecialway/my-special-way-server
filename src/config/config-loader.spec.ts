import * as configLoader from './config-loader';

describe('config loader', () => {
    const NODE_ENV = process.env.NODE_ENV;
    const originalRequire = require;

    it('should throw error if there is no NODE_ENV variable', () => {
        expect.hasAssertions();
        process.env.NODE_ENV = '';

        // initConfig();
        expect(configLoader.initConfig).toThrow('NODE_ENV environment variable not found - you must define it!');
    });

    it('should load config file', () => {
        expect.hasAssertions();
        process.env.NODE_ENV = 'dev';

        configLoader.initConfig();
        const config = configLoader.getConfig();

        expect(config).toBeDefined();

    });

    afterAll(() => {
        process.env.NODE_ENV = NODE_ENV;
    });
});