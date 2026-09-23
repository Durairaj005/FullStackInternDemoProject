'use strict';

const { COMPETITION_STATUS, CTA_ACTION } = require('../constants/competitionStatus');

/**
 * Derives the competition lifecycle status from dates and capacity.
 *
 * WHY derive instead of storing?
 * Storing status as a DB field requires cron jobs to update it,
 * introducing clock drift and potential for stale states (e.g. showing
 * "Active" when registration closed 2 minutes ago).
 * Deriving it from timestamps on every read is always accurate.
 *
 * @param {Object} competition  - Mongoose Competition document
 * @returns {string} One of COMPETITION_STATUS values
 */
const deriveCompetitionStatus = (competition) => {
  if (competition.isCancelled) return COMPETITION_STATUS.CANCELLED;

  const now = new Date();
  const { registrationStart, registrationEnd, submissionEnd } = competition.timeline;
  const { registeredCount, maxParticipants } = competition;

  if (now < registrationStart) return COMPETITION_STATUS.UPCOMING;
  if (now > submissionEnd) return COMPETITION_STATUS.ENDED;
  if (now > registrationEnd) return COMPETITION_STATUS.REGISTRATION_CLOSED;
  if (registeredCount >= maxParticipants) return COMPETITION_STATUS.FULL;

  return COMPETITION_STATUS.ACTIVE;
};

/**
 * Calculates remaining seconds until a target date.
 * Returns 0 if the date has already passed.
 *
 * @param {Date} targetDate
 * @returns {number} seconds remaining
 */
const getSecondsUntil = (targetDate) => {
  const diff = new Date(targetDate) - new Date();
  return Math.max(0, Math.floor(diff / 1000));
};

/**
 * Determines whether a competition is currently accepting registrations.
 * Backend-authoritative check — never trust frontend state.
 *
 * @param {Object} competition  - Mongoose Competition document
 * @returns {{ canRegister: boolean, reason: string | null }}
 */
const checkCanRegister = (competition) => {
  const status = deriveCompetitionStatus(competition);

  if (status === COMPETITION_STATUS.CANCELLED) {
    return { canRegister: false, reason: 'CANCELLED' };
  }
  if (status === COMPETITION_STATUS.UPCOMING) {
    return { canRegister: false, reason: 'NOT_STARTED' };
  }
  if (status === COMPETITION_STATUS.ENDED) {
    return { canRegister: false, reason: 'ENDED' };
  }
  if (status === COMPETITION_STATUS.REGISTRATION_CLOSED) {
    return { canRegister: false, reason: 'REGISTRATION_CLOSED' };
  }
  if (status === COMPETITION_STATUS.FULL) {
    return { canRegister: false, reason: 'FULL' };
  }

  return { canRegister: true, reason: null };
};

/**
 * Builds the CTA button configuration the frontend should display.
 *
 * @param {string} status - Derived competition status
 * @param {boolean} isRegistered - Whether the current user is registered
 * @returns {{ text: string, subText: string, enabled: boolean, action: string }}
 */
const buildCtaButton = (status, isRegistered) => {
  if (isRegistered) {
    // User is registered — the primary action becomes submission
    const submissionEnabled =
      status === COMPETITION_STATUS.ACTIVE ||
      status === COMPETITION_STATUS.REGISTRATION_CLOSED;

    return {
      text: 'Upload Submission',
      subText: 'Registered',
      enabled: submissionEnabled,
      action: CTA_ACTION.UPLOAD_SUBMISSION,
    };
  }

  switch (status) {
    case COMPETITION_STATUS.UPCOMING:
      return { text: 'Registration Opens Soon', subText: null, enabled: false, action: CTA_ACTION.NONE };
    case COMPETITION_STATUS.ACTIVE:
      return { text: 'Register Now', subText: null, enabled: true, action: CTA_ACTION.REGISTER };
    case COMPETITION_STATUS.FULL:
      return { text: 'Competition Full', subText: 'No spots available', enabled: false, action: CTA_ACTION.NONE };
    case COMPETITION_STATUS.REGISTRATION_CLOSED:
      return { text: 'Registration Closed', subText: null, enabled: false, action: CTA_ACTION.NONE };
    case COMPETITION_STATUS.ENDED:
      return { text: 'Competition Ended', subText: null, enabled: false, action: CTA_ACTION.NONE };
    case COMPETITION_STATUS.CANCELLED:
      return { text: 'Competition Cancelled', subText: null, enabled: false, action: CTA_ACTION.NONE };
    default:
      return { text: 'Unavailable', subText: null, enabled: false, action: CTA_ACTION.NONE };
  }
};

module.exports = {
  deriveCompetitionStatus,
  getSecondsUntil,
  checkCanRegister,
  buildCtaButton,
};
