'use strict';

/**
 * Competition lifecycle status constants.
 *
 * Why constants?
 * Magic strings scattered across files cause silent bugs when a typo
 * like 'Upcoming' vs 'UPCOMING' goes unnoticed. A single source of
 * truth is easier to refactor and less error-prone.
 */
const COMPETITION_STATUS = Object.freeze({
  UPCOMING: 'UPCOMING',       // Registration has not opened yet
  ACTIVE: 'ACTIVE',           // Registration is open, spots available
  FULL: 'FULL',               // Max participants reached
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED', // Past registrationEnd but before submissionEnd
  ENDED: 'ENDED',             // Past submissionEnd — competition is over
  CANCELLED: 'CANCELLED',     // Admin manually cancelled
});

/**
 * User-facing CTA action identifiers.
 * Frontend maps these to specific navigation actions.
 */
const CTA_ACTION = Object.freeze({
  REGISTER: 'REGISTER',
  UPLOAD_SUBMISSION: 'UPLOAD_SUBMISSION',
  NONE: 'NONE',
});

/**
 * Registration record status values.
 */
const REGISTRATION_STATUS = Object.freeze({
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
});

module.exports = { COMPETITION_STATUS, CTA_ACTION, REGISTRATION_STATUS };
