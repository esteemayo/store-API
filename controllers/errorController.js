const { StatusCodes } = require('http-status-codes');

const handleCastErrorDB = (customError, err) => {
    customError.message = `Invalid ${err.path}: ${err.value}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
};

const handleDuplicateFieldsDB = (customError, err) => {
    const value = err.message.match(/(["'])(\\?.)/)[0];
    customError.message = `Duplicate field value: ${value}, Please use another value!`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
};

const handleValidationErrorDB = (customError, err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    customError.message = `Invalid input data. ${errors.join('. ')}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
};

const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    return res.status(err.statusCode).json({
        message: err.message,
    });
};

module.exports = (err, req, res, next) => {
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went very wrong, please try again later!',
        stack: err.stack,
    }

    if (err.name === 'CastError') handleCastErrorDB(customError, err);
    if (err.code && err.code === 11000) handleDuplicateFieldsDB(customError, err);
    if (err.name === 'ValidationError') handleValidationErrorDB(customError, err);

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(customError, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(customError, res);
    }
};
