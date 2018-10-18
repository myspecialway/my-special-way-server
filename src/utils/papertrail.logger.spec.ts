import { MSWLogger } from './papertrail.logger';
import { ProcessEnvConfig } from '../config/config-interface';

describe('paper trail logger', () => {

    it('Logger should use papertrail in production', async () => {
        const paperTrailLogger = new MSWLogger(true);
        expect(paperTrailLogger.getTransportList().length).toEqual(2);
    });

    it('Logger should use not papertrail in non-production envs', async () => {
        const paperTrailLogger = new MSWLogger(false);
        expect(paperTrailLogger.getTransportList().length).toEqual(1);
    });

});
