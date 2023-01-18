import { StatusCodes } from 'http-status-codes';
import AppError from './appError.js';

class BadRequestError extends AppError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
