import express from 'express';
import cors from 'cors';
import { DutyRepository } from './repositories/duty.repository';
import { DutyService } from './services/duty.service';
import { DutyController } from './controllers/duty.controller';
import { errorMiddleware } from './middlewares/middleware';
import pool from './config/database';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize repositories, services, and controllers using the pool from the database config file.
const dutyRepository = new DutyRepository(pool);
const dutyService = new DutyService(dutyRepository);
const dutyController = new DutyController(dutyService);

// Routes
app.get('/api/duties', dutyController.getAllDuties);
app.get('/api/duties/:id', dutyController.getDutyById);
app.post('/api/duties', dutyController.createDuty);
app.put('/api/duties/:id', dutyController.updateDuty);
app.delete('/api/duties/:id', dutyController.deleteDuty);

// Error handling middleware (must be after routes)
app.use(errorMiddleware);

export default app;