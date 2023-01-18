import { StatusCodes } from 'http-status-codes';
import AppError from './appError.js';

class ForbiddenError extends AppError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default ForbiddenError;
