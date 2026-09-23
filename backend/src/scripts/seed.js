'use strict';

/**
 * Seed Script — Feedants Competition Database
 *
 * Creates 4 competitions covering every lifecycle state:
 *   1. UPCOMING  — Registration not yet open
 *   2. ACTIVE    — Open with plenty of spots (19 of 20 remaining)
 *   3. FULL      — maxParticipants reached, cannot register
 *   4. ENDED     — Past submissionEnd, competition over
 *
 * Also creates 2 existing registrations for demo user "demo_user_001"
 * in the ACTIVE competition (so we can show the "Already Registered" state).
 *
 * Run with:
 *   npm run seed
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../..', '.env') });
// Fallback to two levels up (backend root)
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../..', '.env') });
}

const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('[Seed] MONGODB_URI not found in .env');
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a Date offset by `days` from now */
const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const daysAgo = (days) => daysFromNow(-days);

// ─── Competition Seed Data ────────────────────────────────────────────────────

const competitions = [
  // ═══════════════════════════════════════════════════════
  // COMPETITION 1: THE MAIN DEMO — Matches design reference
  // State: ACTIVE — Registration open, 1 of 20 booked (19 remaining)
  // Demo user "demo_user_001" IS registered here
  // ═══════════════════════════════════════════════════════
  {
    title: 'Feedants Classical Dance',
    category: 'Dance',
    tags: ['Dance', 'Multi-Win', 'Winners get certificate'],
    prizePool: 1500,
    entryFee: 99,
    currency: 'INR',
    maxParticipants: 20,
    registeredCount: 1, // demo_user_001 is already registered
    judge: {
      name: 'Manju Dubey',
      designation: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      introVideoUrl: null,
    },
    timeline: {
      registrationStart: daysAgo(10),
      registrationEnd: daysFromNow(3),      // Register Before: ~10 Aug (3 days from now)
      submissionStart: daysAgo(5),          // Submission Starts: 5 days ago
      submissionEnd: daysFromNow(20),       // Submission Ends: 20 days from now
      resultDate: daysFromNow(25),          // Result Date: 25 days from now
    },
    about:
      'This is an online classical dance competition open for all age groups. ' +
      'Participate from anywhere and showcase your talent. ' +
      'Express your passion through traditional dance.',
    disclaimer:
      'Only contributions from paid participants will be considered for judging.',
    judgingParameters: [
      { title: 'Technical Skill', description: 'Accuracy of classical dance form, footwork, and body posture.', weightage: '40%' },
      { title: 'Expression & Emotion', description: 'Emotional connect and facial expressions during performance.', weightage: '30%' },
      { title: 'Costume & Presentation', description: 'Appropriateness of attire, grooming, and stage presence.', weightage: '20%' },
      { title: 'Creativity', description: 'Originality and creative interpretation of the chosen piece.', weightage: '10%' },
    ],
    rulesAndEligibility: [
      'Open to all age groups.',
      'Solo performances only. No group entries accepted.',
      'Video submission must be 2–5 minutes in duration.',
      'Submitted video must be original and recorded specifically for this competition.',
      'Use of pre-recorded music tracks is allowed.',
      'Participants must submit their entry before the submission deadline.',
    ],
    rewards: [
      { rank: 1, label: '1st Winner', amount: 550 },
      { rank: 2, label: '2nd Winner', amount: 300 },
      { rank: 3, label: '3rd Winner', amount: 240 },
      { rank: 4, label: '4th Winner', amount: 200 },
      { rank: 5, label: '5th Winner', amount: 130 },
      { rank: 6, label: '6th Winner', amount: 80 },
    ],
    previousWinners: [
      { name: 'Riya Shah', rankTitle: '1st Winner', imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg', videoUrl: null },
      { name: 'Aarav Mehta', rankTitle: '1st Winner', imageUrl: 'https://randomuser.me/api/portraits/men/33.jpg', videoUrl: null },
      { name: 'Neha Verma', rankTitle: '2nd Winner', imageUrl: 'https://randomuser.me/api/portraits/women/55.jpg', videoUrl: null },
      { name: 'Ishita Cho', rankTitle: '3rd Winner', imageUrl: 'https://randomuser.me/api/portraits/women/67.jpg', videoUrl: null },
    ],
    referralLink: 'https://feedants.com/r/referral123',
    referralEarning: 10,
    isCancelled: false,
  },

  // ═══════════════════════════════════════════════════════
  // COMPETITION 2: UPCOMING
  // State: Registration has NOT opened yet
  // ═══════════════════════════════════════════════════════
  {
    title: 'Feedants Vocal Harmony Contest',
    category: 'Singing',
    tags: ['Singing', 'Solo'],
    prizePool: 2500,
    entryFee: 149,
    currency: 'INR',
    maxParticipants: 50,
    registeredCount: 0,
    judge: {
      name: 'Priya Nair',
      designation: 'Hindustani Classical Vocalist',
      experience: '15+ Years of Experience',
      imageUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      introVideoUrl: null,
    },
    timeline: {
      registrationStart: daysFromNow(5),      // Starts 5 days from now
      registrationEnd: daysFromNow(20),
      submissionStart: daysFromNow(10),
      submissionEnd: daysFromNow(35),
      resultDate: daysFromNow(45),
    },
    about:
      'A premium singing competition designed to discover vocal talent across India. ' +
      'Open to all classical and semi-classical singing styles.',
    disclaimer: 'Only contributions from paid participants will be considered.',
    judgingParameters: [
      { title: 'Sur (Pitch Accuracy)', description: 'Accuracy of notes and scale adherence.', weightage: '40%' },
      { title: 'Taal (Rhythm)', description: 'Timing and rhythm consistency throughout the performance.', weightage: '30%' },
      { title: 'Voice Quality', description: 'Clarity, tone, and breath control.', weightage: '30%' },
    ],
    rulesAndEligibility: [
      'Open to all age groups.',
      'Video must be between 3–7 minutes.',
      'Acapella and accompanied performances both accepted.',
    ],
    rewards: [
      { rank: 1, label: '1st Winner', amount: 1000 },
      { rank: 2, label: '2nd Winner', amount: 750 },
      { rank: 3, label: '3rd Winner', amount: 500 },
    ],
    previousWinners: [],
    referralLink: 'https://feedants.com/r/singing2026',
    referralEarning: 15,
    isCancelled: false,
  },

  // ═══════════════════════════════════════════════════════
  // COMPETITION 3: FULL
  // State: maxParticipants reached — no spots available
  // ═══════════════════════════════════════════════════════
  {
    title: 'Feedants Painting Showcase',
    category: 'Art',
    tags: ['Art', 'Painting', 'Certificate'],
    prizePool: 3000,
    entryFee: 79,
    currency: 'INR',
    maxParticipants: 15,
    registeredCount: 15, // FULL — exactly at capacity
    judge: {
      name: 'Arvind Sharma',
      designation: 'Contemporary Artist & Art Educator',
      experience: '20+ Years of Experience',
      imageUrl: 'https://randomuser.me/api/portraits/men/56.jpg',
      introVideoUrl: null,
    },
    timeline: {
      registrationStart: daysAgo(15),
      registrationEnd: daysFromNow(5),  // Still within registration window but FULL
      submissionStart: daysAgo(5),
      submissionEnd: daysFromNow(15),
      resultDate: daysFromNow(20),
    },
    about:
      'A prestigious painting competition celebrating the diversity of Indian art forms. ' +
      'Submit your best artwork and compete with talented artists nationwide.',
    disclaimer: 'Submissions must be original work. Plagiarism results in disqualification.',
    judgingParameters: [
      { title: 'Originality', description: 'Uniqueness and creative concept.', weightage: '35%' },
      { title: 'Technique', description: 'Mastery of painting technique and medium.', weightage: '35%' },
      { title: 'Composition', description: 'Visual balance, color harmony, and overall composition.', weightage: '30%' },
    ],
    rulesAndEligibility: [
      'Open to all age groups.',
      'Maximum 2 entries per participant.',
      'Artwork must be original and not previously published.',
      'Digital art must include process video.',
    ],
    rewards: [
      { rank: 1, label: '1st Winner', amount: 1200 },
      { rank: 2, label: '2nd Winner', amount: 900 },
      { rank: 3, label: '3rd Winner', amount: 600 },
      { rank: 4, label: '4th Winner', amount: 300 },
    ],
    previousWinners: [
      { name: 'Karan Patel', rankTitle: '1st Winner', imageUrl: 'https://randomuser.me/api/portraits/men/41.jpg', videoUrl: null },
      { name: 'Sneha Kulkarni', rankTitle: '2nd Winner', imageUrl: 'https://randomuser.me/api/portraits/women/32.jpg', videoUrl: null },
    ],
    referralLink: 'https://feedants.com/r/art2026',
    referralEarning: 10,
    isCancelled: false,
  },

  // ═══════════════════════════════════════════════════════
  // COMPETITION 4: ENDED
  // State: Past submissionEnd — competition is over
  // ═══════════════════════════════════════════════════════
  {
    title: 'Feedants Poetry in Motion',
    category: 'Poetry',
    tags: ['Poetry', 'Multi-Win'],
    prizePool: 1000,
    entryFee: 49,
    currency: 'INR',
    maxParticipants: 30,
    registeredCount: 24,
    judge: {
      name: 'Dr. Sunita Rao',
      designation: 'Literary Scholar & Poet',
      experience: '18+ Years of Experience',
      imageUrl: 'https://randomuser.me/api/portraits/women/78.jpg',
      introVideoUrl: null,
    },
    timeline: {
      registrationStart: daysAgo(60),
      registrationEnd: daysAgo(40),   // Registration ended 40 days ago
      submissionStart: daysAgo(45),
      submissionEnd: daysAgo(10),     // Submission ended 10 days ago — ENDED state
      resultDate: daysAgo(5),         // Results already announced
    },
    about:
      'An online poetry recitation competition exploring themes of love, nature, and identity. ' +
      'Open to Hindi, English, and regional language submissions.',
    disclaimer: 'All submitted poems must be original compositions.',
    judgingParameters: [
      { title: 'Content & Depth', description: 'Depth of thought and thematic relevance.', weightage: '40%' },
      { title: 'Language & Diction', description: 'Command of language and vocabulary.', weightage: '30%' },
      { title: 'Delivery & Expression', description: 'Recitation clarity and emotional delivery.', weightage: '30%' },
    ],
    rulesAndEligibility: [
      'Open to ages 12 and above.',
      'Poems must be original — no published works.',
      'Maximum 5 minutes recitation time.',
    ],
    rewards: [
      { rank: 1, label: '1st Winner', amount: 400 },
      { rank: 2, label: '2nd Winner', amount: 300 },
      { rank: 3, label: '3rd Winner', amount: 200 },
      { rank: 4, label: '4th Winner', amount: 100 },
    ],
    previousWinners: [
      { name: 'Meera Joshi', rankTitle: '1st Winner', imageUrl: 'https://randomuser.me/api/portraits/women/90.jpg', videoUrl: null },
      { name: 'Aditya Khanna', rankTitle: '2nd Winner', imageUrl: 'https://randomuser.me/api/portraits/men/77.jpg', videoUrl: null },
    ],
    referralLink: 'https://feedants.com/r/poetry2026',
    referralEarning: 5,
    isCancelled: false,
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing data
    await Competition.deleteMany({});
    await Registration.deleteMany({});
    console.log('[Seed] Cleared existing competitions and registrations');

    // Insert competitions
    const insertedCompetitions = await Competition.insertMany(competitions);
    console.log(`[Seed] Inserted ${insertedCompetitions.length} competitions:`);
    insertedCompetitions.forEach((c, i) => {
      console.log(`  [${i + 1}] ${c.title} (${c._id})`);
    });

    // Create a registration for "demo_user_001" in Competition 1 (ACTIVE)
    // This demonstrates the "Already Registered" state in the UI
    const activeCompetition = insertedCompetitions[0];
    await Registration.create({
      competitionId: activeCompetition._id,
      userId: 'demo_user_001',
      status: 'CONFIRMED',
      paymentDetails: {
        orderId: 'order_seed_001',
        paymentId: 'pay_seed_001',
        amountPaid: activeCompetition.entryFee,
        paymentMethod: 'Razorpay',
      },
      registeredAt: daysAgo(3),
    });
    console.log(`[Seed] Created registration for demo_user_001 in "${activeCompetition.title}"`);

    // Print summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  SEED COMPLETE — Test IDs');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    insertedCompetitions.forEach((c) => {
      const state =
        c.registeredCount >= c.maxParticipants
          ? 'FULL'
          : new Date() < c.timeline.registrationStart
          ? 'UPCOMING'
          : new Date() > c.timeline.submissionEnd
          ? 'ENDED'
          : 'ACTIVE';
      console.log(`  ${state.padEnd(10)} | ${c._id} | ${c.title}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Demo user: demo_user_001');
    console.log('  Already registered in Competition 1 (ACTIVE)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (err) {
    console.error('[Seed] Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB');
  }
};

seed();
