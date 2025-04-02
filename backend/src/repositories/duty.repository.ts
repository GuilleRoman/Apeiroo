import { Pool, PoolClient } from "pg";
import { Duty, CreateDutyDto, UpdateDutyDto } from "../models/duty.models";
import { DatabaseError } from "../utils/errors";
import { logger } from "../utils/logger"; // Import the logger

/**
 * Data layer, interacts with the database to perform CRUD operations and return the results.
 */
export class DutyRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<Duty[]> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM duties ORDER BY created_at DESC"
      );
      logger.debug("Successfully fetched all duties from the database."); // Log success
      return result.rows;
    } catch (error) {
      logger.error("Failed to fetch duties from the database:", error); // Log error
      throw new DatabaseError("Failed to fetch duties", error);
    }
  }

  async findById(id: number): Promise<Duty | null> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM duties WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        logger.debug(`Duty with id ${id} not found.`); // Log debug
        return null;
      }
      logger.debug(
        `Successfully fetched duty with id ${id} from the database.`
      ); // Log success
      return result.rows[0];
    } catch (error) {
      logger.error(
        `Failed to fetch duty with id ${id} from the database:`,
        error
      ); // Log error
      throw new DatabaseError(`Failed to fetch duty with id ${id}`, error);
    }
  }

  async create(dutyData: CreateDutyDto): Promise<Duty> {
    try {
      if (!dutyData.name || dutyData.name.trim().length === 0) {
        throw new DatabaseError("Duty name cannot be empty");
      }
      const result = await this.pool.query(
        "INSERT INTO duties (name) VALUES ($1) RETURNING *",
        [dutyData.name]
      );
      logger.debug("Successfully created a new duty in the database."); // Log success
      return result.rows[0];
    } catch (error) {
      logger.error("Failed to create a new duty in the database:", error); // Log error
      throw new DatabaseError("Failed to create duty", error);
    }
  }

  async update(id: number, dutyData: UpdateDutyDto): Promise<Duty | null> {
    try {
      const result = await this.pool.query(
        "UPDATE duties SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [dutyData.name, id]
      );
      if (result.rows.length === 0) {
        logger.debug(`Duty with id ${id} not found for update.`); // Log debug
        return null;
      }
      logger.debug(`Successfully updated duty with id ${id} in the database.`); // Log success
      return result.rows[0] || null;
    } catch (error) {
      logger.error(
        `Failed to update duty with id ${id} in the database:`,
        error
      ); // Log error
      throw new DatabaseError(`Failed to update duty with id ${id}`, error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.pool.query("DELETE FROM duties WHERE id = $1", [
        id,
      ]);
      logger.debug(
        `Successfully deleted duty with id ${id} from the database.`
      ); // Log success
      return result && result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      logger.error(
        `Failed to delete duty with id ${id} from the database:`,
        error
      ); // Log error
      throw new DatabaseError(`Failed to delete duty with id ${id}`, error);
    }
  }

  async executeTransaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      logger.debug("Started database transaction."); // Log debug
      const result = await callback(client);
      await client.query("COMMIT");
      logger.debug("Committed database transaction."); // Log debug
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Database transaction rolled back:", error); // Log error
      throw error;
    } finally {
      client.release();
      logger.debug("Released database client."); // Log debug
    }
  }
}
