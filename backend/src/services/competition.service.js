'use strict';

const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const { AppError } = require('../middleware/errorHandler');
const { COMPETITION_STATUS, REGISTRATION_STATUS } = require('../constants/competitionStatus');
const {
  deriveCompetitionStatus,
  getSecondsUntil,
  checkCanRegister,
  buildCtaButton,
} = require('../utils/dateUtils');

/**
 * Detects whether the current MongoDB deployment supports multi-document transactions.
 * Transactions require a replica set or sharded cluster.
 * In local standalone environments, we use atomic conditional updates with compensating rollback.
 */
let _transactionsSupported = null;
const checkTransactionSupport = async () => {
  if (_transactionsSupported !== null) return _transactionsSupported;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await mongoose.connection.db.collection('__tx_test').findOne({}, { session });
    await session.abortTransaction();
    await session.endSession();
    _transactionsSupported = true;
  } catch (err) {
    _transactionsSupported = false;
  }
  return _transactionsSupported;
};

// ─── getCompetitionDetails ────────────────────────────────────────────────────

/**
 * Fetches full competition details with derived lifecycle state and user state.
 *
 * @param {string} competitionId  - MongoDB ObjectId string
 * @param {string|null} userId    - Optional authenticated user ID
 * @returns {Object} Full competition data with lifecycle, user, and CTA info
 */
const getCompetitionDetails = async (competitionId, userId = null) => {
  // 1. Validate ID format before hitting the DB
  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    throw new AppError('Invalid competition ID format.', 400, 'INVALID_ID');
  }

  // 2. Fetch competition
  const competition = await Competition.findById(competitionId).lean();

  if (!competition) {
    throw new AppError('Competition not found.', 404, 'NOT_FOUND');
  }

  // 3. Derive lifecycle status dynamically from timestamps
  const status = deriveCompetitionStatus(competition);

  // 4. Check if user is registered (only if userId provided)
  let isRegistered = false;
  let registeredAt = null;

  if (userId) {
    const registration = await Registration.findOne({
      competitionId: competition._id,
      userId,
      status: REGISTRATION_STATUS.CONFIRMED,
    })
      .select('registeredAt')
      .lean();

    if (registration) {
      isRegistered = true;
      registeredAt = registration.registeredAt;
    }
  }

  // 5. Build CTA button configuration
  const ctaButton = buildCtaButton(status, isRegistered);

  // 6. Countdown seconds until registration closes
  const registrationClosesInSeconds =
    status === COMPETITION_STATUS.ACTIVE
      ? getSecondsUntil(competition.timeline.registrationEnd)
      : 0;

  // 7. Calculate spots explicitly (guaranteed accurate across all environments)
  const totalSpots = competition.maxParticipants || 0;
  const registeredCount = competition.registeredCount || 0;
  const remainingSpots = Math.max(0, totalSpots - registeredCount);
  const isFull = registeredCount >= totalSpots;
  const progressPercentage =
    totalSpots > 0 ? Math.min(100, Math.round((registeredCount / totalSpots) * 100)) : 0;

  // 8. Build clean response object — never expose isCancelled internals, __v, etc.
  return {
    id: competition._id,
    title: competition.title,
    category: competition.category,
    tags: competition.tags,
    prizePool: competition.prizePool,
    entryFee: competition.entryFee,
    currency: competition.currency,
    spots: {
      total: totalSpots,
      registered: registeredCount,
      remaining: remainingSpots,
      isFull,
      progressPercentage,
    },
    lifecycle: {
      status,
      canRegister: status === COMPETITION_STATUS.ACTIVE && !isFull,
      registrationClosesInSeconds,
      isUpcoming: status === COMPETITION_STATUS.UPCOMING,
      hasEnded: status === COMPETITION_STATUS.ENDED || status === COMPETITION_STATUS.REGISTRATION_CLOSED,
    },
    userState: {
      isRegistered,
      registeredAt,
      actionButton: ctaButton,
    },
    judge: competition.judge,
    timeline: competition.timeline,
    about: competition.about,
    disclaimer: competition.disclaimer,
    judgingParameters: competition.judgingParameters,
    rulesAndEligibility: competition.rulesAndEligibility,
    rewards: competition.rewards,
    previousWinners: competition.previousWinners,
    referralLink: competition.referralLink,
    referralEarning: competition.referralEarning,
  };
};

// ─── registerUser ─────────────────────────────────────────────────────────────

/**
 * Atomically registers a user for a competition.
 *
 * CONCURRENCY STRATEGY (Critical):
 * ─────────────────────────────────
 * Step 1: findOneAndUpdate with $inc and a CONDITIONAL filter:
 *   { _id: id, registeredCount: { $lt: maxParticipants }, registrationEnd: { $gt: now } }
 *
 *   MongoDB evaluates this filter atomically. Only ONE thread among
 *   concurrent requests will succeed on the last available spot.
 *   All others receive null (spot already taken). This prevents overselling.
 *
 * Step 2: Insert Registration (ACID transaction on replica sets, or atomic conditional write
 *   with compensating rollback on standalone MongoDB instances).
 *
 * @param {string} competitionId
 * @param {string} userId
 * @returns {Object} Registration confirmation details
 */
const registerUser = async (competitionId, userId) => {
  // 1. Validate ID format
  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    throw new AppError('Invalid competition ID format.', 400, 'INVALID_ID');
  }

  // 2. Fetch current competition state
  const competition = await Competition.findById(competitionId);

  if (!competition) {
    throw new AppError('Competition not found.', 404, 'NOT_FOUND');
  }

  // 3. Check business rules (backend is the source of truth — never trust frontend)
  const { canRegister, reason } = checkCanRegister(competition);

  if (!canRegister) {
    const messageMap = {
      CANCELLED: 'This competition has been cancelled.',
      NOT_STARTED: 'Registration for this competition has not started yet.',
      ENDED: 'This competition has ended. Registration is closed.',
      REGISTRATION_CLOSED: 'Registration window for this competition has closed.',
      FULL: 'This competition is already full. No spots available.',
    };
    const statusCodeMap = {
      CANCELLED: 400,
      NOT_STARTED: 400,
      ENDED: 400,
      REGISTRATION_CLOSED: 400,
      FULL: 409,
    };
    throw new AppError(messageMap[reason], statusCodeMap[reason], reason);
  }

  // 4. Check for existing registration (fast pre-check)
  const existingRegistration = await Registration.findOne({
    competitionId: competition._id,
    userId,
    status: REGISTRATION_STATUS.CONFIRMED,
  }).lean();

  if (existingRegistration) {
    throw new AppError('You are already registered for this competition.', 409, 'ALREADY_REGISTERED');
  }

  const now = new Date();
  const hasTx = await checkTransactionSupport();

  if (hasTx) {
    // ── ACID Multi-Document Transaction (Replica Set / Production) ──
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedCompetition = await Competition.findOneAndUpdate(
        {
          _id: competition._id,
          registeredCount: { $lt: competition.maxParticipants },
          'timeline.registrationEnd': { $gt: now },
          isCancelled: false,
        },
        { $inc: { registeredCount: 1 } },
        { new: true, session }
      );

      if (!updatedCompetition) {
        await session.abortTransaction();
        throw new AppError(
          'Sorry, the last spot was just taken. This competition is now full.',
          409,
          'COMPETITION_FULL'
        );
      }

      const [newRegistration] = await Registration.create(
        [
          {
            competitionId: competition._id,
            userId,
            status: REGISTRATION_STATUS.CONFIRMED,
            paymentDetails: {
              amountPaid: competition.entryFee,
              paymentMethod: 'Razorpay',
            },
          },
        ],
        { session }
      );

      await session.commitTransaction();

      return {
        registrationId: newRegistration._id,
        competitionId: competition._id,
        competitionTitle: competition.title,
        userId,
        spotsRemaining: updatedCompetition.maxParticipants - updatedCompetition.registeredCount,
        registeredAt: newRegistration.registeredAt,
      };
    } catch (err) {
      await session.abortTransaction();
      if (err.isOperational) throw err;
      if (err.code === 11000) {
        throw new AppError('You are already registered for this competition.', 409, 'ALREADY_REGISTERED');
      }
      throw new AppError('Registration failed due to a server error. Please try again.', 500, 'REGISTRATION_ERROR');
    } finally {
      session.endSession();
    }
  } else {
    // ── Atomic Conditional Increment + Compensating Rollback (Standalone MongoDB) ──
    const updatedCompetition = await Competition.findOneAndUpdate(
      {
        _id: competition._id,
        registeredCount: { $lt: competition.maxParticipants },
        'timeline.registrationEnd': { $gt: now },
        isCancelled: false,
      },
      { $inc: { registeredCount: 1 } },
      { new: true }
    );

    if (!updatedCompetition) {
      throw new AppError(
        'Sorry, the last spot was just taken. This competition is now full.',
        409,
        'COMPETITION_FULL'
      );
    }

    try {
      const newRegistration = await Registration.create({
        competitionId: competition._id,
        userId,
        status: REGISTRATION_STATUS.CONFIRMED,
        paymentDetails: {
          amountPaid: competition.entryFee,
          paymentMethod: 'Razorpay',
        },
      });

      return {
        registrationId: newRegistration._id,
        competitionId: competition._id,
        competitionTitle: competition.title,
        userId,
        spotsRemaining: updatedCompetition.maxParticipants - updatedCompetition.registeredCount,
        registeredAt: newRegistration.registeredAt,
      };
    } catch (createErr) {
      // Compensating action: decrement the reserved count
      await Competition.findByIdAndUpdate(competition._id, { $inc: { registeredCount: -1 } });

      if (createErr.code === 11000) {
        throw new AppError('You are already registered for this competition.', 409, 'ALREADY_REGISTERED');
      }
      throw new AppError('Registration failed due to a server error. Please try again.', 500, 'REGISTRATION_ERROR');
    }
  }
};

// ─── cancelRegistration ───────────────────────────────────────────────────────

/**
 * Cancels an existing registration.
 * Atomically decrements the counter and marks registration as CANCELLED.
 *
 * @param {string} competitionId
 * @param {string} userId
 * @returns {Object} Cancellation confirmation
 */
const cancelRegistration = async (competitionId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    throw new AppError('Invalid competition ID format.', 400, 'INVALID_ID');
  }

  const hasTx = await checkTransactionSupport();

  if (hasTx) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const registration = await Registration.findOneAndUpdate(
        { competitionId, userId, status: REGISTRATION_STATUS.CONFIRMED },
        { status: REGISTRATION_STATUS.CANCELLED },
        { session, new: true }
      );

      if (!registration) {
        await session.abortTransaction();
        throw new AppError('No active registration found for this competition.', 404, 'NOT_REGISTERED');
      }

      await Competition.findOneAndUpdate(
        { _id: competitionId, registeredCount: { $gt: 0 } },
        { $inc: { registeredCount: -1 } },
        { session }
      );

      await session.commitTransaction();

      return { message: 'Registration cancelled successfully.', userId, competitionId };
    } catch (err) {
      await session.abortTransaction();
      if (err.isOperational) throw err;
      throw new AppError('Cancellation failed. Please try again.', 500, 'CANCELLATION_ERROR');
    } finally {
      session.endSession();
    }
  } else {
    const registration = await Registration.findOneAndUpdate(
      { competitionId, userId, status: REGISTRATION_STATUS.CONFIRMED },
      { status: REGISTRATION_STATUS.CANCELLED },
      { new: true }
    );

    if (!registration) {
      throw new AppError('No active registration found for this competition.', 404, 'NOT_REGISTERED');
    }

    await Competition.findOneAndUpdate(
      { _id: competitionId, registeredCount: { $gt: 0 } },
      { $inc: { registeredCount: -1 } }
    );

    return { message: 'Registration cancelled successfully.', userId, competitionId };
  }
};

// ─── getParticipationStatus ───────────────────────────────────────────────────

/**
 * Returns the participation status of a specific user in a competition.
 *
 * @param {string} competitionId
 * @param {string} userId
 * @returns {Object} Participation status
 */
const getParticipationStatus = async (competitionId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    throw new AppError('Invalid competition ID format.', 400, 'INVALID_ID');
  }

  const competition = await Competition.findById(competitionId)
    .select('title maxParticipants registeredCount timeline isCancelled')
    .lean();

  if (!competition) {
    throw new AppError('Competition not found.', 404, 'NOT_FOUND');
  }

  const registration = await Registration.findOne({
    competitionId: competition._id,
    userId,
  })
    .select('status registeredAt')
    .lean();

  const total = competition.maxParticipants || 0;
  const registered = competition.registeredCount || 0;
  const remaining = Math.max(0, total - registered);

  return {
    competitionId,
    userId,
    isRegistered: registration?.status === REGISTRATION_STATUS.CONFIRMED,
    registrationStatus: registration?.status || null,
    registeredAt: registration?.registeredAt || null,
    spotsRemaining: remaining,
    isFull: registered >= total,
    competitionStatus: deriveCompetitionStatus(competition),
  };
};

/**
 * Lists all competitions with their basic stats and lifecycle status.
 */
const listCompetitions = async () => {
  const competitions = await Competition.find({}).sort({ createdAt: -1 }).lean();
  return competitions.map((comp) => {
    const status = deriveCompetitionStatus(comp);
    const spots = {
      total: comp.maxParticipants,
      registered: comp.registeredCount,
      remaining: Math.max(0, comp.maxParticipants - comp.registeredCount),
      isFull: comp.registeredCount >= comp.maxParticipants,
      progressPercentage: Math.min(100, Math.round((comp.registeredCount / comp.maxParticipants) * 100)),
    };
    return {
      id: comp._id.toString(),
      title: comp.title,
      category: comp.category,
      tags: comp.tags,
      prizePool: comp.prizePool,
      entryFee: comp.entryFee,
      currency: comp.currency,
      spots,
      status,
    };
  });
};

module.exports = {
  getCompetitionDetails,
  registerUser,
  cancelRegistration,
  getParticipationStatus,
  listCompetitions,
};
