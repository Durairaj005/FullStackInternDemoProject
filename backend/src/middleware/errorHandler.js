'use strict';

/**
 * Centralized Error Handler Middleware
 *
 * Placed at the END of the Express middleware stack.
 * Catches all errors passed via next(err).
 *
 * Why centralized?
 * Without this, each controller repeats try/catch + res.status().json().
 * Centralization means the response envelope format can never diverge
 * between endpoints. One place to change logging / Sentry integration later.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Log error details in development
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  // ── Mongoose Validation Error ──────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join('; '),
      code: 'VALIDATION_ERROR',
    });
  }

  // ── Mongoose Duplicate Key Error (E11000) ──────────────────────────────────
  // Thrown when the { competitionId, userId } unique index is violated
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'You are already registered for this competition.',
      code: 'ALREADY_REGISTERED',
    });
  }

  // ── Mongoose Cast Error (invalid ObjectId) ─────────────────────────────────
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid competition ID format.',
      code: 'INVALID_ID',
    });
  }

  // ── Custom Application Error (thrown deliberately by service layer) ─────────
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      code: err.code || 'APPLICATION_ERROR',
    });
  }

  // ── Unhandled / Unexpected Error ──────────────────────────────────────────
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
  });
};

/**
 * Operational Error class for intentional, expected failures.
 * Service layer throws these; the centralized handler returns them cleanly.
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };
