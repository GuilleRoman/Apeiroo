import { Request, Response, NextFunction } from "express";
import { DutyService } from "../services/duty.service";
import { CreateDutyDto, UpdateDutyDto } from "../models/duty.models";
import { InvalidIdError, ControllerError } from "../utils/errors";

/**
 * DutyController class.
 * Handles incoming HTTP requests and interacts with the DutyService to process them.
 */
export class DutyController {
  /**
   * @param dutyService - Instance of DutyService to handle business logic.
   */
  constructor(private readonly dutyService: DutyService) {}

  /**
   * Handles GET requests to retrieve all duties.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   */
  async getAllDuties(req: Request, res: Response, next: NextFunction) {
    try {
      // Call the service to get all duties.
      const duties = await this.dutyService.getAllDuties();
      // Send the duties as a JSON response.
      res.json(duties);
    } catch (error) {
      // Pass any errors to the error handling middleware.
      next(error);
    }
  }

  /**
   * Handles GET requests to retrieve a duty by its ID.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   */
  async getDutyById(req: Request, res: Response, next: NextFunction) {
    try {
      // Parse the ID from the request parameters.
      const id = parseInt(req.params.id, 10);
      // Check if the ID is a valid number.
      if (isNaN(id)) {
        // If not, pass an InvalidIdError to the error handling middleware.
        return next(new InvalidIdError());
      }
      // Call the service to get the duty by ID.
      const duty = await this.dutyService.getDutyById(id);
      // Send the duty as a JSON response.
      res.json(duty);
    } catch (error) {
      // Pass any errors to the error handling middleware.
      next(error);
    }
  }

  /**
   * Handles POST requests to create a new duty.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   */
  async createDuty(req: Request, res: Response, next: NextFunction) {
    try {
      // Check if the request body exists.
      if (!req.body) {
        // If not, pass a ControllerError to the error handling middleware.
        return next(new ControllerError("Request body is required"));
      }
      // Extract the duty data from the request body.
      const dutyData: CreateDutyDto = req.body;
      // Call the service to create the new duty.
      const newDuty = await this.dutyService.createDuty(dutyData);
      // Send the new duty as a JSON response with a 201 Created status.
      res.status(201).json(newDuty);
    } catch (error) {
      // Pass any errors to the error handling middleware.
      next(error);
    }
  }

  /**
   * Handles PUT/PATCH requests to update an existing duty.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   */
  async updateDuty(req: Request, res: Response, next: NextFunction) {
    try {
      // Parse the ID from the request parameters.
      const id = parseInt(req.params.id, 10);
      // Check if the ID is a valid number.
      if (isNaN(id)) {
        // If not, pass an InvalidIdError to the error handling middleware.
        return next(new InvalidIdError());
      }
      // Check if the request body exists.
      if (!req.body) {
        // If not, pass a ControllerError to the error handling middleware.
        return next(new ControllerError("Request body is required"));
      }
      // Extract the duty data from the request body.
      const dutyData: UpdateDutyDto = req.body;
      // Call the service to update the duty.
      const updatedDuty = await this.dutyService.updateDuty(id, dutyData);
      // Send the updated duty as a JSON response with a 200 OK status.
      res.status(200).json(updatedDuty);
    } catch (error) {
      // Pass any errors to the error handling middleware.
      next(error);
    }
  }

  /**
   * Handles DELETE requests to delete a duty.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   */
  async deleteDuty(req: Request, res: Response, next: NextFunction) {
    try {
      // Parse the ID from the request parameters.
      const id = parseInt(req.params.id, 10);
      // Check if the ID is a valid number.
      if (isNaN(id)) {
        // If not, pass an InvalidIdError to the error handling middleware.
        return next(new InvalidIdError());
      }
      // Call the service to delete the duty.
      const deletedDuty = await this.dutyService.deleteDuty(id);
      // Send the deleted duty as a JSON response with a 200 OK status.
      res.status(200).json(deletedDuty);
    } catch (error) {
      // Pass any errors to the error handling middleware.
      next(error);
    }
  }
}
