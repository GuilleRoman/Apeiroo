import winston from 'winston';

jest.mock('winston', () => ({
    createLogger: jest.fn().mockReturnValue({
        info: jest.fn(),
    }),
    format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        errors: jest.fn(),
        splat: jest.fn(),
        json: jest.fn(),
        colorize: jest.fn(),
        printf: jest.fn(),
    },
    transports: {
        Console: jest.fn(),
        File: jest.fn(),
    }
}));

describe('Logger', () => {
    let logger: any;
    let morganStream: any;

    beforeEach(() => {
        jest.clearAllMocks();
        delete require.cache[require.resolve('../utils/logger')]; // Correct path
        const loggerModule = require('../utils/logger'); // Correct path
        logger = loggerModule.logger;
        morganStream = loggerModule.morganStream;
    });
    
    it('should call winston.createLogger', () => {
        delete require.cache[require.resolve('../utils/logger')];
        require('../utils/logger');
        expect(winston.createLogger).toHaveBeenCalled();
    });

    it('should log a message using morganStream', () => {
        const message = 'Test log message';
        morganStream.write(message);
        expect(logger.info).toHaveBeenCalledWith(message.trim());
    });

    it('should trim the message before logging with morganStream', () => {
        const message = ' Test log message  \n';
        morganStream.write(message);
        expect(logger.info).toHaveBeenCalledWith('Test log message');
    });
});