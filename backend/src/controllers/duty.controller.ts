import { Request, Response, NextFunction } from 'express';
import { DutyService } from '../services/duty.service';
import { CreateDutyDto, UpdateDutyDto } from '../models/duty.models';

export class DutyController {
  constructor(private dutyService: DutyService) {}

  getAllDuties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const duties = await this.dutyService.getAllDuties();
      res.json(duties);
    } catch (error) {
      next(error);
    }
  };

  getDutyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const duty = await this.dutyService.getDutyById(id);
      res.json(duty);
    } catch (error) {
      next(error);
    }
  };

  createDuty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dutyData: CreateDutyDto = req.body;
      const newDuty = await this.dutyService.createDuty(dutyData);
      res.status(201).json(newDuty);
    } catch (error) {
      next(error);
    }
  };

  updateDuty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const dutyData: UpdateDutyDto = req.body;
      const updatedDuty = await this.dutyService.updateDuty(id, dutyData);
      res.json(updatedDuty);
    } catch (error) {
      next(error);
    }
  };

  deleteDuty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deletedDuty = await this.dutyService.deleteDuty(id);
      res.json(deletedDuty);
    } catch (error) {
      next(error);
    }
  };
}