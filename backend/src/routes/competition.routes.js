'use strict';

const { Router } = require('express');
const controller = require('../controllers/competition.controller');
const { validate, schemas } = require('../middleware/validate');
const { registrationLimiter } = require('../middleware/rateLimiter');

const router = Router();

/**
 * Competition Routes
 *
 * Pattern: route → [validation middleware] → [rate limiter] → controller
 *
 * Keeping routes thin — no business logic or response building here.
 */

// ── GET /api/competitions ─────────────────────────────────────────────────────
// List all competitions with basic info & status
router.get('/', controller.listCompetitions);

// ── GET /api/competitions/:id ─────────────────────────────────────────────────
// Fetch full competition details + user's registration state
router.get(
  '/:id',
  validate(schemas.getCompetition, 'query'),
  controller.getCompetition
);

// ── POST /api/competitions/:id/register ───────────────────────────────────────
// Register a user for a competition (concurrency-safe, atomic)
router.post(
  '/:id/register',
  registrationLimiter,                              // Prevent button spam
  validate(schemas.registerCompetition, 'body'),
  controller.registerForCompetition
);

// ── DELETE /api/competitions/:id/register ─────────────────────────────────────
// Cancel an existing registration
router.delete(
  '/:id/register',
  validate(schemas.cancelRegistration, 'body'),
  controller.cancelRegistration
);

// ── GET /api/competitions/:id/participation ───────────────────────────────────
// Check registration status for a given user
router.get(
  '/:id/participation',
  validate(schemas.getParticipation, 'query'),
  controller.getParticipation
);

module.exports = router;
