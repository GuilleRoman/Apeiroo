import { Request, Response, NextFunction } from "express";
import { DutyService } from "../services/duty.service";
import { CreateDutyDto, UpdateDutyDto } from "../models/duty.models";
import { InvalidIdError, ControllerError } from "../utils/errors";

/**
 * @swagger
 * tags:
 *   name: Duties
 *   description: API for managing duties
 */
export class DutyController {
  /**
   * @param dutyService - Instance of DutyService to handle business logic.
   */
  constructor(private readonly dutyService: DutyService) {}

   /**
   * @swagger
   * /duties:
   *   get:
   *     summary: Get all duties
   *     tags: [Duties]
   *     responses:
   *       200:
   *         description: A list of duties
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Duty'
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
   * @swagger
   * /duties/{id}:
   *   get:
   *     summary: Get a duty by ID
   *     tags: [Duties]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The duty ID
   *     responses:
   *       200:
   *         description: The requested duty
   *       400:
   *         description: Invalid ID
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
   * @swagger
   * /duties:
   *   post:
   *     summary: Create a new duty
   *     tags: [Duties]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateDutyDto'
   *     responses:
   *       201:
   *         description: The created duty
   *       400:
   *         description: Bad request
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
   * @swagger
   * /duties/{id}:
   *   put:
   *     summary: Update an existing duty
   *     tags: [Duties]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateDutyDto'
   *     responses:
   *       200:
   *         description: The updated duty
   *       400:
   *         description: Invalid request
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
   * @swagger
   * /duties/{id}:
   *   delete:
   *     summary: Delete a duty
   *     tags: [Duties]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: The deleted duty
   *       400:
   *         description: Invalid ID
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
