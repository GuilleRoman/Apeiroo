import { Pool, PoolClient } from 'pg';
import { Duty, CreateDutyDto, UpdateDutyDto } from '../models/duty.models';
import { DatabaseError } from '../utils/errors';

export class DutyRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<Duty[]> {
    try {
      const result = await this.pool.query('SELECT * FROM duties ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch duties', error);
    }
  }

  async findById(id: number): Promise<Duty | null> {
    try {
      const result = await this.pool.query('SELECT * FROM duties WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch duty with id ${id}`, error);
    }
  }

  async create(dutyData: CreateDutyDto): Promise<Duty> {
    try {
      const result = await this.pool.query(
        'INSERT INTO duties (name) VALUES ($1) RETURNING *',
        [dutyData.name]
      );
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError('Failed to create duty', error);
    }
  }

  async update(id: number, dutyData: UpdateDutyDto): Promise<Duty | null> {
    try {
      const result = await this.pool.query(
        'UPDATE duties SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [dutyData.name, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new DatabaseError(`Failed to update duty with id ${id}`, error);
    }
  }

  async delete(id: number): Promise<Duty | null> {
    try {
      const result = await this.pool.query('DELETE FROM duties WHERE id = $1 RETURNING *', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new DatabaseError(`Failed to delete duty with id ${id}`, error);
    }
  }

  async executeTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}