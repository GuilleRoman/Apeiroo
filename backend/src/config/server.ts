import dotenv from 'dotenv';

dotenv.config();

const serverConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  logLevel: process.env.LOG_LEVEL || 'info',
  apiPrefix: process.env.API_PREFIX || '/api'
};

export default serverConfig;