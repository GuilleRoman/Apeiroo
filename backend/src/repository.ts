import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',  // ✅ Use Docker service name
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'todo_db',
});

export default pool;
