'use strict';

const rateLimit = require('express-rate-limit');
const config = require('../config/env');

/**
 * Rate limiter for registration endpoints.
 *
 * Why?
 * Prevents a user from spamming the Register button (e.g. triple-tap)
 * and prevents brute-force abuse. Also reduces accidental duplicate
 * requests from retrying frontend code.
 *
 * 10 requests per minute per IP on the registration route.
 * This is intentionally generous for an internship demo but stricter
 * than having no limit at all.
 */
const registrationLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // Default: 1 minute
  max: config.rateLimit.max,           // Default: 10 per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Too many requests. Please wait a moment before trying again.',
    code: 'RATE_LIMITED',
  },
  skipSuccessfulRequests: false,
});

/**
 * General API limiter — more permissive for GET requests.
 * 100 requests per minute per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Too many requests. Please try again shortly.',
    code: 'RATE_LIMITED',
  },
});

module.exports = { registrationLimiter, generalLimiter };
