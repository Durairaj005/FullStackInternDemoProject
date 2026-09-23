'use strict';

/**
 * Backend Integration Tests
 * Tests all API endpoints and business rules against a real MongoDB connection.
 *
 * Uses supertest to fire real HTTP requests through the Express app.
 * Uses a separate test database to avoid polluting development data.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../src/app');
const Competition = require('../src/models/Competition');
const Registration = require('../src/models/Registration');

let app;

// ─── Test Data Factories ──────────────────────────────────────────────────────

const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const daysAgo = (days) => daysFromNow(-days);

const makeActiveCompetition = (overrides = {}) => ({
  title: 'Test Dance Competition',
  category: 'Dance',
  tags: ['Dance'],
  prizePool: 1500,
  entryFee: 99,
  currency: 'INR',
  maxParticipants: 5,
  registeredCount: 0,
  judge: {
    name: 'Test Judge',
    designation: 'Dancer',
    experience: '10+ Years',
  },
  timeline: {
    registrationStart: daysAgo(5),
    registrationEnd: daysFromNow(5),
    submissionStart: daysAgo(2),
    submissionEnd: daysFromNow(10),
    resultDate: daysFromNow(15),
  },
  about: 'A test competition',
  ...overrides,
});

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeAll(async () => {
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants_test';
  process.env.PORT = '5001';
  process.env.NODE_ENV = 'test';
  await mongoose.connect(process.env.MONGODB_URI);
  app = createApp();
});

afterAll(async () => {
  await Competition.deleteMany({});
  await Registration.deleteMany({});
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Competition.deleteMany({});
  await Registration.deleteMany({});
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/competitions/:id', () => {
  test('returns 200 with full competition details for a valid active competition', async () => {
    const comp = await Competition.create(makeActiveCompetition());

    const res = await request(app).get(`/api/competitions/${comp._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(comp._id.toString());
    expect(res.body.data.lifecycle.status).toBe('ACTIVE');
    expect(res.body.data.lifecycle.canRegister).toBe(true);
    expect(res.body.data.spots.total).toBe(5);
    expect(res.body.data.spots.remaining).toBe(5);
  });

  test('returns 400 for an invalid MongoDB ObjectId format', async () => {
    const res = await request(app).get('/api/competitions/not-a-valid-id');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('INVALID_ID');
  });

  test('returns 404 for a valid ObjectId that does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/competitions/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('NOT_FOUND');
  });

  test('returns UPCOMING status for a competition that has not started yet', async () => {
    const comp = await Competition.create(makeActiveCompetition({
      timeline: {
        registrationStart: daysFromNow(3), // Not started yet
        registrationEnd: daysFromNow(10),
        submissionStart: daysFromNow(5),
        submissionEnd: daysFromNow(20),
        resultDate: daysFromNow(25),
      },
    }));

    const res = await request(app).get(`/api/competitions/${comp._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.lifecycle.status).toBe('UPCOMING');
    expect(res.body.data.lifecycle.canRegister).toBe(false);
  });

  test('returns ENDED status for a competition past its submissionEnd', async () => {
    const comp = await Competition.create(makeActiveCompetition({
      timeline: {
        registrationStart: daysAgo(30),
        registrationEnd: daysAgo(20),
        submissionStart: daysAgo(25),
        submissionEnd: daysAgo(5), // Ended 5 days ago
        resultDate: daysAgo(2),
      },
    }));

    const res = await request(app).get(`/api/competitions/${comp._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.lifecycle.status).toBe('ENDED');
    expect(res.body.data.lifecycle.canRegister).toBe(false);
  });

  test('returns FULL status when registeredCount equals maxParticipants', async () => {
    const comp = await Competition.create(makeActiveCompetition({
      maxParticipants: 3,
      registeredCount: 3,
    }));

    const res = await request(app).get(`/api/competitions/${comp._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.lifecycle.status).toBe('FULL');
    expect(res.body.data.spots.remaining).toBe(0);
    expect(res.body.data.spots.isFull).toBe(true);
  });

  test('shows isRegistered=true when userId is already registered', async () => {
    const comp = await Competition.create(makeActiveCompetition({ registeredCount: 1 }));
    await Registration.create({
      competitionId: comp._id,
      userId: 'user_test_001',
      status: 'CONFIRMED',
      paymentDetails: { amountPaid: 99 },
    });

    const res = await request(app)
      .get(`/api/competitions/${comp._id}`)
      .query({ userId: 'user_test_001' });

    expect(res.status).toBe(200);
    expect(res.body.data.userState.isRegistered).toBe(true);
    expect(res.body.data.userState.actionButton.action).toBe('UPLOAD_SUBMISSION');
  });

  test('shows isRegistered=false when userId has not registered', async () => {
    const comp = await Competition.create(makeActiveCompetition());

    const res = await request(app)
      .get(`/api/competitions/${comp._id}`)
      .query({ userId: 'user_not_registered' });

    expect(res.status).toBe(200);
    expect(res.body.data.userState.isRegistered).toBe(false);
    expect(res.body.data.userState.actionButton.action).toBe('REGISTER');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/competitions/:id/register', () => {
  test('successfully registers a new user and returns 201', async () => {
    const comp = await Competition.create(makeActiveCompetition());

    const res = await request(app)
      .post(`/api/competitions/${comp._id}/register`)
      .send({ userId: 'new_user_001' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userId).toBe('new_user_001');
    expect(res.body.data.spotsRemaining).toBe(4);

    // Verify counter was incremented in DB
    const updated = await Competition.findById(comp._id);
    expect(updated.registeredCount).toBe(1);
  });

  test('returns 409 ALREADY_REGISTERED when user tries to register twice', async () => {
    const comp = await Competition.create(makeActiveCompetition({ registeredCount: 1 }));
    await Registration.create({
      competitionId: comp._id,
      userId: 'existing_user',
      status: 'CONFIRMED',
      paymentDetails: { amountPaid: 99 },
    });

    const res = await request(app)
      .post(`/api/competitions/${comp._id}/register`)
      .send({ userId: 'existing_user' });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('ALREADY_REGISTERED');
  });

  test('returns 409 FULL when competition has reached maxParticipants', async () => {
    const comp = await Competition.create(makeActiveCompetition({
      maxParticipants: 2,
      registeredCount: 2, // Already full
    }));

    const res = await request(app)
      .post(`/api/competitions/${comp._id}/register`)
      .send({ userId: 'late_user' });

    expect(res.status).toBe(409);
    expect(['FULL', 'COMPETITION_FULL'].includes(res.body.code)).toBe(true);
  });

  test('returns 400 for a competition that has ended', async () => {
    const comp = await Competition.create(makeActiveCompetition({
      timeline: {
        registrationStart: daysAgo(30),
        registrationEnd: daysAgo(20),
        submissionStart: daysAgo(25),
        submissionEnd: daysAgo(5),
        resultDate: daysAgo(2),
      },
    }));

    const res = await request(app)
      .post(`/api/competitions/${comp._id}/register`)
      .send({ userId: 'too_late_user' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('ENDED');
  });

  test('returns 400 for a competition that has not started yet', async () => {
    const comp = await Competition.create(makeActiveCompetition({
      timeline: {
        registrationStart: daysFromNow(5),
        registrationEnd: daysFromNow(15),
        submissionStart: daysFromNow(7),
        submissionEnd: daysFromNow(20),
        resultDate: daysFromNow(25),
      },
    }));

    const res = await request(app)
      .post(`/api/competitions/${comp._id}/register`)
      .send({ userId: 'early_user' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('NOT_STARTED');
  });

  test('returns 400 for missing userId in request body', async () => {
    const comp = await Competition.create(makeActiveCompetition());

    const res = await request(app)
      .post(`/api/competitions/${comp._id}/register`)
      .send({}); // No userId

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  test('returns 400 for invalid competition ID', async () => {
    const res = await request(app)
      .post('/api/competitions/bad-id/register')
      .send({ userId: 'user_001' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_ID');
  });

  test('returns 404 for non-existent competition', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/competitions/${fakeId}/register`)
      .send({ userId: 'user_001' });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe('NOT_FOUND');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/competitions/:id/participation', () => {
  test('returns isRegistered=true for a confirmed registration', async () => {
    const comp = await Competition.create(makeActiveCompetition({ registeredCount: 1 }));
    await Registration.create({
      competitionId: comp._id,
      userId: 'user_check',
      status: 'CONFIRMED',
      paymentDetails: { amountPaid: 99 },
    });

    const res = await request(app)
      .get(`/api/competitions/${comp._id}/participation`)
      .query({ userId: 'user_check' });

    expect(res.status).toBe(200);
    expect(res.body.data.isRegistered).toBe(true);
    expect(res.body.data.registrationStatus).toBe('CONFIRMED');
  });

  test('returns isRegistered=false for an unregistered user', async () => {
    const comp = await Competition.create(makeActiveCompetition());

    const res = await request(app)
      .get(`/api/competitions/${comp._id}/participation`)
      .query({ userId: 'user_never_registered' });

    expect(res.status).toBe(200);
    expect(res.body.data.isRegistered).toBe(false);
    expect(res.body.data.registrationStatus).toBeNull();
  });

  test('returns 400 when userId query param is missing', async () => {
    const comp = await Competition.create(makeActiveCompetition());

    const res = await request(app)
      .get(`/api/competitions/${comp._id}/participation`);

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Concurrency — Capacity Protection', () => {
  /**
   * This test simulates 10 concurrent registration attempts
   * for a competition with only 3 spots.
   *
   * Expected:
   * - Exactly 3 succeed (status 201)
   * - Remaining 7 fail (409 FULL or ALREADY_REGISTERED)
   * - DB registeredCount === 3
   * - No overselling
   */
  test('prevents overselling when multiple users register simultaneously', async () => {
    const SPOTS = 3;
    const CONCURRENT_USERS = 10;

    const comp = await Competition.create(makeActiveCompetition({
      maxParticipants: SPOTS,
      registeredCount: 0,
    }));

    // Fire all requests simultaneously
    const requests = Array.from({ length: CONCURRENT_USERS }, (_, i) =>
      request(app)
        .post(`/api/competitions/${comp._id}/register`)
        .send({ userId: `concurrent_user_${i}` })
    );

    const responses = await Promise.all(requests);

    const successes = responses.filter((r) => r.status === 201);
    const failures = responses.filter((r) => r.status !== 201);

    console.log(
      `[Concurrency Test] Successes: ${successes.length}, Failures: ${failures.length}`
    );

    // Verify in database
    const finalComp = await Competition.findById(comp._id);
    const finalRegistrations = await Registration.countDocuments({
      competitionId: comp._id,
      status: 'CONFIRMED',
    });

    expect(successes.length).toBe(SPOTS);             // Exactly SPOTS succeed
    expect(failures.length).toBe(CONCURRENT_USERS - SPOTS);
    expect(finalComp.registeredCount).toBe(SPOTS);    // Counter matches
    expect(finalRegistrations).toBe(SPOTS);           // Registration records match
  }, 30000); // Extended timeout for concurrent operations
});
