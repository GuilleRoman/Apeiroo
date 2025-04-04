import {
    BaseError,
    NotFoundError,
    ValidationError,
    DatabaseError,
    InvalidIdError,
    ServiceError,
    ControllerError,
} from '../utils/errors'; // Adjust the import path

describe('Error Classes', () => {
    it('should create a BaseError instance', () => {
        const error = new BaseError('Test BaseError', 400);
        expect(error).toBeInstanceOf(BaseError);
        expect(error.message).toBe('Test BaseError');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('BaseError');
    });

    it('should create a NotFoundError instance', () => {
        const error = new NotFoundError('Test NotFoundError');
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe('Test NotFoundError');
        expect(error.statusCode).toBe(404);
        expect(error.name).toBe('NotFoundError');
    });

    it('should create a ValidationError instance', () => {
        const error = new ValidationError('Test ValidationError');
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.message).toBe('Test ValidationError');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('ValidationError');
    });

    it('should create a DatabaseError instance', () => {
        const originalError = new Error('Original Database Error');
        const error = new DatabaseError('Test DatabaseError', originalError);
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.message).toBe('Test DatabaseError');
        expect(error.statusCode).toBe(500);
        expect(error.name).toBe('DatabaseError');
        expect(error.originalError).toBe(originalError);
    });

    it('should create an InvalidIdError instance', () => {
        const error = new InvalidIdError();
        expect(error).toBeInstanceOf(InvalidIdError);
        expect(error.message).toBe('Invalid ID format, ID should be an integer');
        expect(error.statusCode).toBe(400); // Because InvalidIdError extends ValidationError
        expect(error.name).toBe('InvalidIdError');
    });

    it('should create a ServiceError instance', () => {
        const originalError = new Error('Original Service Error');
        const error = new ServiceError('Test ServiceError', originalError);
        expect(error).toBeInstanceOf(ServiceError);
        expect(error.message).toBe('Test ServiceError');
        expect(error.statusCode).toBe(500);
        expect(error.name).toBe('ServiceError');
        expect(error.originalError).toBe(originalError);
    });

    it('should create a ControllerError instance', () => {
        const originalError = new Error('Original Controller Error');
        const error = new ControllerError('Test ControllerError', originalError);
        expect(error).toBeInstanceOf(ControllerError);
        expect(error.message).toBe('Test ControllerError');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('ControllerError');
        expect(error.originalError).toBe(originalError);
    });
});