'use strict';

const mongoose = require('mongoose');
const { REGISTRATION_STATUS } = require('../constants/competitionStatus');

/**
 * Registration Schema
 *
 * Design decisions:
 * 1. COMPOUND UNIQUE INDEX on { competitionId, userId }
 *    This is the primary defense against duplicate registrations.
 *    Even if two concurrent requests pass all application-level checks,
 *    MongoDB will reject the second insert with an E11000 DuplicateKey
 *    error, which our service layer catches and handles gracefully.
 *    WHY DB-LEVEL: Application code (if-then-insert) is not atomic.
 *    A DB-level unique constraint IS atomic.
 *
 * 2. userId is stored as a String (not ObjectId).
 *    WHY: The assignment does not specify an auth system. String IDs
 *    (e.g. "user_123" from JWT sub claims, Firebase UIDs, or any other
 *    auth provider) remain flexible without a tight auth dependency.
 *
 * 3. paymentDetails is optional for now (entryFee=0 edge case) but
 *    structured to accept Razorpay payment references in production.
 */
const registrationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: [true, 'Competition ID is required'],
      index: true,
    },

    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(REGISTRATION_STATUS),
      default: REGISTRATION_STATUS.CONFIRMED,
    },

    paymentDetails: {
      orderId: { type: String, default: null },    // Razorpay order ID
      paymentId: { type: String, default: null },  // Razorpay payment ID
      amountPaid: { type: Number, required: true },
      paymentMethod: { type: String, default: 'Razorpay' },
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ─── THE CRITICAL INDEX ────────────────────────────────────────────────────────
/**
 * Compound unique index prevents duplicate registrations at the database engine level.
 *
 * Why this matters for concurrency:
 * User A and User B both register simultaneously.
 * Both pass the application-level "already registered?" check (race condition).
 * Both attempt INSERT.
 * MongoDB's write lock on the index ensures only ONE succeeds.
 * The other receives E11000 DuplicateKeyError — handled gracefully.
 *
 * The `sparse: false` default means null userId/competitionId are NOT exempt.
 */
registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

/**
 * Index to efficiently look up all registrations for a competition
 * (e.g. for admin dashboard, participant count verification).
 */
registrationSchema.index({ competitionId: 1, status: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
