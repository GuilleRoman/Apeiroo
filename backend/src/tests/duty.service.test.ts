import { DutyService } from '../services/duty.service';
import { DutyRepository } from '../repositories/duty.repository';
import { Duty, CreateDutyDto, UpdateDutyDto } from '../models/duty.models';
import { NotFoundError, ValidationError, ServiceError } from '../utils/errors';
import { logger } from '../utils/logger';

jest.mock('../utils/logger'); // Mock the logger

describe('DutyService', () => {
    let dutyRepository: DutyRepository;
    let dutyService: DutyService;

    beforeEach(() => {
        dutyRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as any;
        dutyService = new DutyService(dutyRepository);
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should get all duties', async () => {
        const duties: Duty[] = [{ id: 1, name: 'Duty 1' }, { id: 2, name: 'Duty 2' }];
        (dutyRepository.findAll as jest.Mock).mockResolvedValue(duties);
        const result = await dutyService.getAllDuties();
        expect(dutyRepository.findAll).toHaveBeenCalled();
        expect(result).toEqual(duties);
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Getting all duties.');
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Successfully retrieved all duties.');
    });

    it('should get a duty by id', async () => {
        const duty: Duty = { id: 1, name: 'Duty 1' };
        (dutyRepository.findById as jest.Mock).mockResolvedValue(duty);
        const result = await dutyService.getDutyById(1);
        expect(dutyRepository.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual(duty);
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Getting duty by id 1.');
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Successfully retrieved duty by id 1.');
    });

    it('should throw ServiceError if duty not found', async () => {
        (dutyRepository.findById as jest.Mock).mockResolvedValue(null);
        await expect(dutyService.getDutyById(1)).rejects.toThrow(ServiceError);
        expect(logger.warn).toHaveBeenCalledWith('DutyService: Duty with id 1 not found.');
    });

    it('should create a duty', async () => {
        const dutyData: CreateDutyDto = { name: 'New Duty' };
        const newDuty: Duty = { id: 3, ...dutyData };
        (dutyRepository.create as jest.Mock).mockResolvedValue(newDuty);
        const result = await dutyService.createDuty(dutyData);
        expect(dutyRepository.create).toHaveBeenCalledWith(dutyData);
        expect(result).toEqual(newDuty);
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Creating new duty.');
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Successfully created new duty.');
    });

    it('should update a duty', async () => {
        const dutyData: UpdateDutyDto = { name: 'Updated Duty' };
        const updatedDuty: Duty = { id: 1, ...dutyData };
        (dutyRepository.update as jest.Mock).mockResolvedValue(updatedDuty);
        const result = await dutyService.updateDuty(1, dutyData);
        expect(dutyRepository.update).toHaveBeenCalledWith(1, dutyData);
        expect(result).toEqual(updatedDuty);
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Updating duty with id 1.');
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Successfully updated duty with id 1.');
    });

    it('should throw ServiceError if duty not found for update', async () => {
        (dutyRepository.update as jest.Mock).mockResolvedValue(null);
        await expect(dutyService.updateDuty(1, { name: 'Updated Duty' })).rejects.toThrow(ServiceError);
        expect(logger.warn).toHaveBeenCalledWith('DutyService: Duty with id 1 not found for update.');
    });

    it('should delete a duty', async () => {
        (dutyRepository.delete as jest.Mock).mockResolvedValue(true);
        const result = await dutyService.deleteDuty(1);
        expect(dutyRepository.delete).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Deleting duty with id 1.');
        expect(logger.debug).toHaveBeenCalledWith('DutyService: Successfully deleted duty with id 1.');
    });

    it('should throw ServiceError if duty not found for delete', async () => {
        (dutyRepository.delete as jest.Mock).mockResolvedValue(null);
        await expect(dutyService.deleteDuty(1)).rejects.toThrow(ServiceError);
        expect(logger.warn).toHaveBeenCalledWith('DutyService: Duty with id 1 not found for deletion.');
    });

    it('should validate duty data', () => {
        const invalidData1: CreateDutyDto = { name: '' };
        const invalidData2: CreateDutyDto = { name: 'a'.repeat(256) };
        const invalidData3: CreateDutyDto = { name: 'Invalid@Name' };
        const invalidData4: CreateDutyDto = { name: ' name ' };

        expect(() => dutyService['validateDutyData'](invalidData1)).toThrow(ValidationError);
        expect(() => dutyService['validateDutyData'](invalidData2)).toThrow(ValidationError);
        expect(() => dutyService['validateDutyData'](invalidData3)).toThrow(ValidationError);
        expect(() => dutyService['validateDutyData'](invalidData4)).toThrow(ValidationError);

        const validData: CreateDutyDto = { name: 'Valid Duty' };
        expect(() => dutyService['validateDutyData'](validData)).not.toThrow();
    });

    it('should throw ServiceError on repository error', async () => {
        (dutyRepository.findAll as jest.Mock).mockRejectedValue(new Error('Repository Error'));
        await expect(dutyService.getAllDuties()).rejects.toThrow(ServiceError);
        expect(logger.error).toHaveBeenCalledWith('DutyService: Error retrieving duties:', expect.any(Error));
    });
});