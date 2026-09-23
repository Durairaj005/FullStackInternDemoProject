'use strict';

const competitionService = require('../services/competition.service');
const { successResponse, createdResponse } = require('../utils/apiResponse');

/**
 * Competition Controller
 *
 * Responsibility: HTTP-level only.
 * - Extracts params/body from req
 * - Calls the appropriate service method
 * - Sends the response
 * - Passes errors to next() for centralized handling
 *
 * Controllers contain NO business logic. That lives in the service layer.
 */

// GET /api/competitions/:id
const getCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const data = await competitionService.getCompetitionDetails(id, userId || null);
    return successResponse(res, data, 'Competition details retrieved successfully');
  } catch (err) {
    return next(err);
  }
};

// POST /api/competitions/:id/register
const registerForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const data = await competitionService.registerUser(id, userId);
    return createdResponse(res, data, 'Registration successful! Welcome to the competition.');
  } catch (err) {
    return next(err);
  }
};

// DELETE /api/competitions/:id/register
const cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const data = await competitionService.cancelRegistration(id, userId);
    return successResponse(res, data, 'Registration cancelled successfully.');
  } catch (err) {
    return next(err);
  }
};

// GET /api/competitions/:id/participation
const getParticipation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const data = await competitionService.getParticipationStatus(id, userId);
    return successResponse(res, data, 'Participation status retrieved.');
  } catch (err) {
    return next(err);
  }
};

// GET /api/competitions
const listCompetitions = async (req, res, next) => {
  try {
    const data = await competitionService.listCompetitions();
    return successResponse(res, data, 'Competitions retrieved successfully');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCompetition,
  registerForCompetition,
  cancelRegistration,
  getParticipation,
  listCompetitions,
};
