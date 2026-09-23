'use strict';

const mongoose = require('mongoose');

/**
 * Competition Schema
 *
 * Design decisions:
 * 1. `registeredCount` is stored as a denormalized counter alongside
 *    the registrations collection. This allows O(1) spot lookups without
 *    expensive COUNT(*) aggregation queries under high concurrency.
 *    It is updated atomically (via $inc) during registration — never via
 *    separate read-modify-write operations.
 *
 * 2. All lifecycle dates live in a nested `timeline` subdocument to
 *    group related fields and allow clear partial projection.
 *
 * 3. Status is NOT stored — it is derived on-read from timeline dates
 *    and registeredCount using dateUtils.deriveCompetitionStatus().
 */
const rewardSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true, min: 1 },
    label: { type: String, required: true, trim: true }, // '1st Winner'
    amount: { type: Number, required: true, min: 0 },    // 550
  },
  { _id: false }
);

const winnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rankTitle: { type: String, required: true, trim: true }, // '1st Winner'
    imageUrl: { type: String, default: null },
    videoUrl: { type: String, default: null },
  },
  { _id: false }
);

const judgingParameterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    weightage: { type: String, default: '' }, // e.g. '30%'
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true,
      maxlength: [200, 'Title must be under 200 characters'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    // ─── Financials ───────────────────────────────────────────────────────────
    prizePool: {
      type: Number,
      required: [true, 'Prize pool amount is required'],
      min: [0, 'Prize pool cannot be negative'],
    },

    entryFee: {
      type: Number,
      required: [true, 'Entry fee is required'],
      min: [0, 'Entry fee cannot be negative'],
    },

    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD'],
    },

    // ─── Capacity ─────────────────────────────────────────────────────────────
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: [1, 'Must allow at least 1 participant'],
    },

    /**
     * Denormalized counter — updated atomically via $inc during registration.
     * WHY: Avoids COUNT queries on the registrations collection per API call.
     * Atomic $inc with a conditional findOneAndUpdate prevents overselling.
     */
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, 'Registered count cannot be negative'],
    },

    // ─── Judge ────────────────────────────────────────────────────────────────
    judge: {
      name: { type: String, required: true, trim: true },
      designation: { type: String, required: true, trim: true },
      experience: { type: String, required: true, trim: true },
      imageUrl: { type: String, default: null },
      introVideoUrl: { type: String, default: null },
    },

    // ─── Timeline ─────────────────────────────────────────────────────────────
    timeline: {
      registrationStart: {
        type: Date,
        required: [true, 'Registration start date is required'],
      },
      registrationEnd: {
        type: Date,
        required: [true, 'Registration end date is required'],
      },
      submissionStart: {
        type: Date,
        required: [true, 'Submission start date is required'],
      },
      submissionEnd: {
        type: Date,
        required: [true, 'Submission end date is required'],
      },
      resultDate: {
        type: Date,
        required: [true, 'Result date is required'],
      },
    },

    // ─── Content ──────────────────────────────────────────────────────────────
    about: {
      type: String,
      required: [true, 'About text is required'],
      trim: true,
    },

    disclaimer: {
      type: String,
      default: 'Only contributions from paid participants will be considered for judging.',
      trim: true,
    },

    judgingParameters: {
      type: [judgingParameterSchema],
      default: [],
    },

    rulesAndEligibility: {
      type: [String],
      default: [],
    },

    rewards: {
      type: [rewardSchema],
      default: [],
    },

    previousWinners: {
      type: [winnerSchema],
      default: [],
    },

    referralLink: {
      type: String,
      default: null,
    },

    referralEarning: {
      type: Number,
      default: 10, // ₹10 per signup
    },

    // ─── Admin Controls ───────────────────────────────────────────────────────
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,      // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Support queries filtered by registration deadline (most common listing query)
competitionSchema.index({ 'timeline.registrationEnd': 1 });

// Support filtering active, non-cancelled competitions efficiently
competitionSchema.index({ isCancelled: 1, 'timeline.registrationEnd': 1 });

// ─── Virtuals ─────────────────────────────────────────────────────────────────
/**
 * Remaining spots — derived on the fly.
 * Frontend should rely on this instead of computing maxParticipants - registeredCount itself.
 */
competitionSchema.virtual('remainingSpots').get(function () {
  return Math.max(0, this.maxParticipants - this.registeredCount);
});

competitionSchema.virtual('isFull').get(function () {
  return this.registeredCount >= this.maxParticipants;
});

competitionSchema.virtual('progressPercentage').get(function () {
  if (this.maxParticipants === 0) return 0;
  return Math.min(100, Math.round((this.registeredCount / this.maxParticipants) * 100));
});

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
