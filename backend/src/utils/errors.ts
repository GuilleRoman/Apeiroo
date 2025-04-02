export class BaseError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, public originalError?: any) {
    super(message, 500);
    this.originalError = originalError;
  }
}