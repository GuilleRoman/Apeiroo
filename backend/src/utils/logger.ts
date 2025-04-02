import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'todo-api' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
        )
      ),
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs to combined.log
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Create a stream object with a 'write' function that will be used by morgan
// THIS IS THE CORRECT WAY TO IMPLEMENT IT.
const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger, morganStream }; // Export both the logger and morganStream.