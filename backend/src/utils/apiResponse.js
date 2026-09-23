'use strict';

/**
 * Standardized API response helpers.
 *
 * Why?
 * Every endpoint must return the same { success, data, message } envelope.
 * Helper functions ensure zero inconsistency between controllers.
 */

const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const createdResponse = (res, data = {}, message = 'Created successfully') => {
  return successResponse(res, data, message, 201);
};

const errorResponse = (res, message = 'Something went wrong', statusCode = 500, code = null) => {
  const body = { success: false, message };
  if (code) body.code = code;
  return res.status(statusCode).json(body);
};

const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, 404, 'NOT_FOUND');
};

const validationErrorResponse = (res, message) => {
  return errorResponse(res, message, 400, 'VALIDATION_ERROR');
};

const conflictResponse = (res, message, code) => {
  return errorResponse(res, message, 409, code);
};

const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, 401, 'UNAUTHORIZED');
};

module.exports = {
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
  conflictResponse,
  unauthorizedResponse,
};
