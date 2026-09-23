'use strict';

const Joi = require('joi');

/**
 * Validation schemas using Joi.
 *
 * Why Joi over manual if-checks?
 * Declarative schemas are self-documenting, composable, and produce
 * consistent, detailed error messages without repetitive code.
 */

const schemas = {
  // GET /api/competitions/:id — query params
  getCompetition: Joi.object({
    userId: Joi.string().trim().max(128).optional().allow(''),
  }),

  // POST /api/competitions/:id/register — request body
  registerCompetition: Joi.object({
    userId: Joi.string().trim().min(1).max(128).required().messages({
      'string.empty': 'User ID cannot be empty.',
      'any.required': 'User ID is required to register.',
    }),
  }),

  // DELETE /api/competitions/:id/register — request body
  cancelRegistration: Joi.object({
    userId: Joi.string().trim().min(1).max(128).required().messages({
      'string.empty': 'User ID cannot be empty.',
      'any.required': 'User ID is required.',
    }),
  }),

  // GET /api/competitions/:id/participation — query params
  getParticipation: Joi.object({
    userId: Joi.string().trim().min(1).max(128).required().messages({
      'any.required': 'userId query parameter is required.',
    }),
  }),
};

/**
 * validate(schema, source)
 *
 * Returns Express middleware that validates the specified request source
 * (body, query, params) against a Joi schema.
 *
 * On failure: responds 400 with clear validation message.
 * On success: calls next().
 *
 * @param {Joi.ObjectSchema} schema
 * @param {'body' | 'query' | 'params'} source
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: true,    // Return only the first error (cleaner UX)
      allowUnknown: false, // Reject unexpected fields
      stripUnknown: true,  // Remove any unknown fields that pass
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        code: 'VALIDATION_ERROR',
      });
    }

    // Replace req[source] with the sanitized/stripped value
    req[source] = value;
    return next();
  };
};

module.exports = { validate, schemas };
