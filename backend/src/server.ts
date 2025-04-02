import app from './app';
import {logger, morganStream} from './utils/logger';
import serverConfig from './config/server';
import pool from './config/database';
import morgan from 'morgan'

const { port } = serverConfig;

// Start the server
async function startServer() {
  try {
    // Initialize database
    try {
      // Test connection and create tables if needed
      const client = await pool.connect();
      await client.query(`
        CREATE TABLE IF NOT EXISTS duties (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      client.release();
      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Database initialization failed:', error);
      process.exit(1);
    }
    // Use morgan with the custom stream
    app.use(morgan('combined', { stream: morganStream }));
    // Start the server
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  // Close database connections, etc.
  process.exit(0);
});

// Start the application
startServer();