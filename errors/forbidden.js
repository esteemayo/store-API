const { StatusCodes } = require('http-status-codes');
const AppError = require('./appError');

class ForbiddenError extends AppError {
    constructor(message) {
        super(message);

        this.statusCode = StatusCodes.FORBIDDEN;
    };
};

module.exports = ForbiddenError;
