import { Request, Response, NextFunction } from 'express';
import { DutyController } from '../src/controllers/duty.controller';
import { DutyService } from '../src/services/duty.service';
import { CreateDutyDto, UpdateDutyDto } from '../src/models/duty.models';
import { InvalidIdError, ControllerError } from '../src/utils/errors';

describe('DutyController', () => {
    let dutyService: DutyService;
    let dutyController: DutyController;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        dutyService = {
            getAllDuties: jest.fn(),
            getDutyById: jest.fn(),
            createDuty: jest.fn(),
            updateDuty: jest.fn(),
            deleteDuty: jest.fn(),
        } as any;
        dutyController = new DutyController(dutyService);
        mockReq = {};
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
    });

    it('should get all duties', async () => {
        const duties = [{ id: 1, name: 'Duty 1' }, { id: 2, name: 'Duty 2' }];
        (dutyService.getAllDuties as jest.Mock).mockResolvedValue(duties);
        await dutyController.getAllDuties(mockReq as Request, mockRes as Response, mockNext);
        expect(dutyService.getAllDuties).toHaveBeenCalled();
        expect(mockRes.json).toHaveBeenCalledWith(duties);
    });

    it('should get a duty by id', async () => {
        mockReq = { params: { id: '1' } };
        const duty = { id: 1, name: 'Duty 1' };
        (dutyService.getDutyById as jest.Mock).mockResolvedValue(duty);
        await dutyController.getDutyById(mockReq as Request, mockRes as Response, mockNext);
        expect(dutyService.getDutyById).toHaveBeenCalledWith(1);
        expect(mockRes.json).toHaveBeenCalledWith(duty);
    });

    it('should handle invalid id for getDutyById', async () => {
        mockReq = { params: { id: 'invalid' } };
        await dutyController.getDutyById(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new InvalidIdError());
    });

    it('should create a duty', async () => {
        const dutyData: CreateDutyDto = { name: 'New Duty' };
        const newDuty = { id: 3, ...dutyData };
        mockReq = { body: dutyData };
        (dutyService.createDuty as jest.Mock).mockResolvedValue(newDuty);
        await dutyController.createDuty(mockReq as Request, mockRes as Response, mockNext);
        expect(dutyService.createDuty).toHaveBeenCalledWith(dutyData);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(newDuty);
    });

    it('should handle missing request body for createDuty', async () => {
        mockReq = {};
        await dutyController.createDuty(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new ControllerError('Request body is required'));
    });

    it('should update a duty', async () => {
        mockReq = { params: { id: '1' }, body: { name: 'Updated Duty' } };
        const updatedDuty = { id: 1, name: 'Updated Duty' };
        (dutyService.updateDuty as jest.Mock).mockResolvedValue(updatedDuty);
        await dutyController.updateDuty(mockReq as Request, mockRes as Response, mockNext);
        expect(dutyService.updateDuty).toHaveBeenCalledWith(1, mockReq.body);
        expect(mockRes.json).toHaveBeenCalledWith(updatedDuty);
    });

    it('should handle invalid id for updateDuty', async () => {
        mockReq = { params: { id: 'invalid' } };
        await dutyController.updateDuty(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new InvalidIdError());
    });

    it('should handle missing request body for updateDuty', async () => {
        mockReq = { params: { id: '1' } };
        await dutyController.updateDuty(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new ControllerError('Request body is required'));
    });

    it('should delete a duty', async () => {
        mockReq = { params: { id: '1' } };
        const deletedDuty = { id: 1, name: 'Deleted Duty' };
        (dutyService.deleteDuty as jest.Mock).mockResolvedValue(deletedDuty);
        await dutyController.deleteDuty(mockReq as Request, mockRes as Response, mockNext);
        expect(dutyService.deleteDuty).toHaveBeenCalledWith(1);
        expect(mockRes.json).toHaveBeenCalledWith(deletedDuty);
    });

    it('should handle invalid id for deleteDuty', async () => {
        mockReq = { params: { id: 'invalid' } };
        await dutyController.deleteDuty(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new InvalidIdError());
    });
});