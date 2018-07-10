
describe('config loader', () => {
    const NODE_ENV = process.env.NODE_ENV;
    const originalRequire = require;

    afterEach(() => {
        jest.resetModules();
    });
    it('should throw error if there is no NODE_ENV variable', async () => {
        expect.hasAssertions();
        process.env.NODE_ENV = '';

        try {
            await import('./config-loader');
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    it('should throw error if NODE_ENV is incorrect', async () => {
        expect.hasAssertions();
        process.env.NODE_ENV = 'some-non-existing-config';

        try {
            await import('./config-loader');
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    it('should load config file', async () => {
        jest.resetModules();
        expect.hasAssertions();
        process.env.NODE_ENV = 'dev';

        const configModule = await import('./config-loader');
        const config = configModule.getConfig();

        expect(config).toBeDefined();

    });
});
