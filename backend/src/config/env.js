'use strict';

require('dotenv').config();

/**
 * Centralized environment configuration.
 * Validates all required variables are present at startup —
 * prevents cryptic runtime failures caused by missing config.
 */
const required = ['MONGODB_URI', 'PORT'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[Config] FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 10,
  },
};

module.exports = config;
