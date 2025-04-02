import { DutyRepository } from '../repositories/duty.repository';
import { Duty, CreateDutyDto, UpdateDutyDto } from '../models/duty.models';
import { NotFoundError, ValidationError } from '../utils/errors';

export class DutyService {
  constructor(private dutyRepository: DutyRepository) {}

  async getAllDuties(): Promise<Duty[]> {
    return this.dutyRepository.findAll();
  }

  async getDutyById(id: number): Promise<Duty> {
    const duty = await this.dutyRepository.findById(id);
    if (!duty) {
      throw new NotFoundError(`Duty with id ${id} not found`);
    }
    return duty;
  }

  async createDuty(dutyData: CreateDutyDto): Promise<Duty> {
    this.validateDutyData(dutyData);
    return this.dutyRepository.create(dutyData);
  }

  async updateDuty(id: number, dutyData: UpdateDutyDto): Promise<Duty> {
    this.validateDutyData(dutyData);
    
    const updatedDuty = await this.dutyRepository.update(id, dutyData);
    if (!updatedDuty) {
      throw new NotFoundError(`Duty with id ${id} not found`);
    }
    return updatedDuty;
  }

  async deleteDuty(id: number): Promise<Duty> {
    const deletedDuty = await this.dutyRepository.delete(id);
    if (!deletedDuty) {
      throw new NotFoundError(`Duty with id ${id} not found`);
    }
    return deletedDuty;
  }

  private validateDutyData(data: CreateDutyDto | UpdateDutyDto): void {
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Duty name cannot be empty');
    }
    
    if (data.name.length > 255) {
      throw new ValidationError('Duty name cannot exceed 255 characters');
    }
  }
}