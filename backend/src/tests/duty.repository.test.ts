import { Pool, PoolClient, QueryResult } from 'pg';
import { DutyRepository } from '../repositories/duty.repository';
import { Duty, CreateDutyDto, UpdateDutyDto } from '../models/duty.models';
import { DatabaseError } from '../utils/errors';
import { logger } from '../utils/logger';

jest.mock('../utils/logger'); // Mock the logger

describe('DutyRepository', () => {
    let pool: Pool;
    let dutyRepository: DutyRepository;
    let mockQuery: jest.Mock;
    let mockConnect: jest.Mock;
    let mockClient: Partial<PoolClient>;

    beforeEach(() => {
        mockQuery = jest.fn();
        mockConnect = jest.fn();
        mockClient = {
            query: mockQuery,
            release: jest.fn(),
        };
        pool = {
            query: mockQuery,
            connect: mockConnect.mockResolvedValue(mockClient),
        } as any;
        dutyRepository = new DutyRepository(pool);
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should find all duties', async () => {
        const duties: Duty[] = [{ id: 1, name: 'Duty 1' }, { id: 2, name: 'Duty 2' }];
        mockQuery.mockResolvedValue({ rows: duties });
        const result = await dutyRepository.findAll();
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM duties ORDER BY created_at DESC');
        expect(result).toEqual(duties);
        expect(logger.debug).toHaveBeenCalledWith('Successfully fetched all duties from the database.');
    });

    it('should find a duty by id', async () => {
        const duty: Duty = { id: 1, name: 'Duty 1' };
        mockQuery.mockResolvedValue({ rows: [duty] });
        const result = await dutyRepository.findById(1);
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM duties WHERE id = $1', [1]);
        expect(result).toEqual(duty);
        expect(logger.debug).toHaveBeenCalledWith('Successfully fetched duty with id 1 from the database.');
    });

    it('should return null if duty not found', async () => {
        mockQuery.mockResolvedValue({ rows: [] });
        const result = await dutyRepository.findById(1);
        expect(result).toBeNull();
        expect(logger.debug).toHaveBeenCalledWith('Duty with id 1 not found.');
    });

    it('should create a duty', async () => {
        const dutyData: CreateDutyDto = { name: 'New Duty' };
        const newDuty: Duty = { id: 3, ...dutyData };
        mockQuery.mockResolvedValue({ rows: [newDuty] });
        const result = await dutyRepository.create(dutyData);
        expect(mockQuery).toHaveBeenCalledWith('INSERT INTO duties (name) VALUES ($1) RETURNING *', [dutyData.name]);
        expect(result).toEqual(newDuty);
        expect(logger.debug).toHaveBeenCalledWith('Successfully created a new duty in the database.');
    });

    it('should update a duty', async () => {
        const dutyData: UpdateDutyDto = { name: 'Updated Duty' };
        const updatedDuty: Duty = { id: 1, ...dutyData };
        mockQuery.mockResolvedValue({ rows: [updatedDuty] });
        const result = await dutyRepository.update(1, dutyData);
        expect(mockQuery).toHaveBeenCalledWith('UPDATE duties SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [dutyData.name, 1]);
        expect(result).toEqual(updatedDuty);
        expect(logger.debug).toHaveBeenCalledWith('Successfully updated duty with id 1 in the database.');
    });

    it('should return null if duty not found for update', async () => {
        mockQuery.mockResolvedValue({ rows: [] });
        const result = await dutyRepository.update(1, { name: 'Updated Duty' });
        expect(result).toBeNull();
        expect(logger.debug).toHaveBeenCalledWith('Duty with id 1 not found for update.');
    });

    it('should delete a duty', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });
        const result = await dutyRepository.delete(1);
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM duties WHERE id = $1', [1]);
        expect(result).toBe(true);
        expect(logger.debug).toHaveBeenCalledWith('Successfully deleted duty with id 1 from the database.');
    });

    it('should return false if duty not found for delete', async () => {
        mockQuery.mockResolvedValue({ rowCount: 0 });
        const result = await dutyRepository.delete(1);
        expect(result).toBe(false);
    });

    it('should execute a transaction', async () => {
        const callback = jest.fn().mockResolvedValue('transaction result');
        const result = await dutyRepository.executeTransaction(callback);
        expect(mockConnect).toHaveBeenCalled();
        expect(mockQuery).toHaveBeenCalledWith('BEGIN');
        expect(callback).toHaveBeenCalledWith(mockClient);
        expect(mockQuery).toHaveBeenCalledWith('COMMIT');
        expect(mockClient.release).toHaveBeenCalled();
        expect(result).toBe('transaction result');
        expect(logger.debug).toHaveBeenCalledWith('Started database transaction.');
        expect(logger.debug).toHaveBeenCalledWith('Committed database transaction.');
        expect(logger.debug).toHaveBeenCalledWith('Released database client.');
    });

    it('should rollback a transaction on error', async () => {
        const callback = jest.fn().mockRejectedValue(new Error('Transaction Error'));
        await expect(dutyRepository.executeTransaction(callback)).rejects.toThrow('Transaction Error');
        expect(mockQuery).toHaveBeenCalledWith('ROLLBACK');
        expect(mockClient.release).toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith('Database transaction rolled back:', expect.any(Error));
    });

    it('should throw DatabaseError on query error', async () => {
        mockQuery.mockRejectedValue(new Error('Database Error'));
        await expect(dutyRepository.findAll()).rejects.toThrow(DatabaseError);
        expect(logger.error).toHaveBeenCalledWith('Failed to fetch duties from the database:', expect.any(Error));
    });
});