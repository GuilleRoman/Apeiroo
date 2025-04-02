import { DutyRepository } from "../repositories/duty.repository";
import { Duty, CreateDutyDto, UpdateDutyDto } from "../models/duty.models";
import { NotFoundError, ValidationError, ServiceError } from "../utils/errors"; // Import ServiceError
import { logger } from "../utils/logger";

export class DutyService {
  constructor(private dutyRepository: DutyRepository) {}

  async getAllDuties(): Promise<Duty[]> {
    logger.debug("DutyService: Getting all duties.");
    try {
      const duties = await this.dutyRepository.findAll();
      logger.debug("DutyService: Successfully retrieved all duties.");
      return duties;
    } catch (error) {
      logger.error("DutyService: Error retrieving duties:", error);
      throw new ServiceError("Failed to retrieve duties", error);
    }
  }

  async getDutyById(id: number): Promise<Duty> {
    logger.debug(`DutyService: Getting duty by id ${id}.`);
    try {
      const duty = await this.dutyRepository.findById(id);
      if (!duty) {
        logger.warn(`DutyService: Duty with id ${id} not found.`);
        throw new NotFoundError(`Duty with id ${id} not found`);
      }
      logger.debug(`DutyService: Successfully retrieved duty by id ${id}.`);
      return duty;
    } catch (error) {
      logger.error(`DutyService: Error retrieving duty by id ${id}:`, error);
      throw new ServiceError(`Failed to retrieve duty by id ${id}`, error);
    }
  }

  async createDuty(dutyData: CreateDutyDto): Promise<Duty> {
    logger.debug("DutyService: Creating new duty.");
    try {
      this.validateDutyData(dutyData);
      const newDuty = await this.dutyRepository.create(dutyData);
      logger.debug("DutyService: Successfully created new duty.");
      return newDuty;
    } catch (error) {
      logger.error("DutyService: Error creating duty:", error);
      throw new ServiceError("Failed to create duty", error);
    }
  }

  async updateDuty(id: number, dutyData: UpdateDutyDto): Promise<Duty> {
    logger.debug(`DutyService: Updating duty with id ${id}.`);
    try {
      this.validateDutyData(dutyData);
      const updatedDuty = await this.dutyRepository.update(id, dutyData);
      if (!updatedDuty) {
        logger.warn(`DutyService: Duty with id ${id} not found for update.`);
        throw new NotFoundError(`Duty with id ${id} not found`);
      }
      logger.debug(`DutyService: Successfully updated duty with id ${id}.`);
      return updatedDuty;
    } catch (error) {
      logger.error(`DutyService: Error updating duty with id ${id}:`, error);
      throw new ServiceError(`Failed to update duty with id ${id}`, error);
    }
  }

  async deleteDuty(id: number): Promise<boolean> {
    logger.debug(`DutyService: Deleting duty with id ${id}.`);
    try {
      const deletedDuty = await this.dutyRepository.delete(id);
      if (!deletedDuty) {
        logger.warn(`DutyService: Duty with id ${id} not found for deletion.`);
        throw new NotFoundError(`Duty with id ${id} not found`);
      }
      logger.debug(`DutyService: Successfully deleted duty with id ${id}.`);
      return deletedDuty;
    } catch (error) {
      logger.error(`DutyService: Error deleting duty with id ${id}:`, error);
      throw new ServiceError(`Failed to delete duty with id ${id}`, error);
    }
  }

  private validateDutyData(data: CreateDutyDto | UpdateDutyDto): void {
    if (!data.name || data.name.trim() === "") {
      logger.warn("DutyService: Duty name cannot be empty.");
      throw new ValidationError("Duty name cannot be empty");
    }

    if (data.name.length > 255) {
      logger.warn("DutyService: Duty name exceeds 255 characters.");
      throw new ValidationError("Duty name cannot exceed 255 characters");
    }

    // Check for special characters (e.g., allow only alphanumeric and spaces)
    const specialCharRegex = /[^a-zA-Z0-9\s]/;

    if (specialCharRegex.test(data.name)) {
      logger.warn("DutyService: Duty name contains invalid characters.");
      throw new ValidationError("Duty name contains invalid characters");
    }

    // Check for leading or trailing spaces
    if (data.name !== data.name.trim()) {
      logger.warn(
        "DutyService: Duty name contains leading or trailing spaces."
      );
      throw new ValidationError(
        "Duty name cannot have leading or trailing spaces"
      );
    }
  }
}
