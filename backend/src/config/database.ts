// config/database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url'; // Import the URL module

dotenv.config();

let dbConfig = {};
// Try reading .env, else set default values.
if (process.env.DATABASE_URL) {
    const dbUrl = new URL(process.env.DATABASE_URL);
    dbConfig = {
        host: dbUrl.hostname,
        port: dbUrl.port ? parseInt(dbUrl.port, 10) : 5432,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.substring(1),
        max: parseInt(process.env.DB_POOL_MAX || '10', 10),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
        connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000', 10)
    };
} else {
    dbConfig = {
        host: process.env.DB_HOST || 'postgres-db', // Use postgres-db as default
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'todo_db',
        max: parseInt(process.env.DB_POOL_MAX || '10', 10),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
        connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000', 10)
    };
}

// Create and export the pool instance
const pool = new Pool(dbConfig);

export default pool;