import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BaseError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`);

  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
    return; // Important: Return after sending the response
  }

  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal server error',
  });
  // Important: No return needed here as this is the last response.
};