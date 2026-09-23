'use strict';

const mongoose = require('mongoose');
const config = require('./env');

/**
 * MongoDB connection manager.
 *
 * Why a dedicated module?
 * Centralizes connection lifecycle, keeps server.js clean,
 * and makes it easy to mock the DB connection in tests.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // mongoose 7+ no longer needs these but explicit for clarity
      maxPoolSize: 10,        // Allows up to 10 concurrent DB connections (scales with load)
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is unreachable
      socketTimeoutMS: 45000, // Drop idle sockets after 45s
    });

    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);
    process.exit(1); // Stop the server — app cannot function without DB
  }
};

// Log connection events for observability
mongoose.connection.on('disconnected', () => {
  console.warn('[DB] MongoDB disconnected. Attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('[DB] MongoDB reconnected.');
});

module.exports = connectDB;
