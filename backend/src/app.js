'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const competitionRoutes = require('./routes/competition.routes');
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const createApp = () => {
  const app = express();

  // ── Security & Parsing Middleware ──────────────────────────────────────────
  app.use(cors({
    origin: '*',          // In production: restrict to your frontend domain
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '10kb' })); // Reject payloads > 10kb
  app.use(express.urlencoded({ extended: false }));

  // ── Logging (disabled in test environment) ─────────────────────────────────
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // ── Rate Limiting (global) ─────────────────────────────────────────────────
  app.use('/api/', generalLimiter);

  // ── Health Check (useful for deployment and monitoring) ───────────────────
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Feedants API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // ── API Routes ─────────────────────────────────────────────────────────────
  app.use('/api/competitions', competitionRoutes);

  // ── 404 Handler (must come after all routes) ───────────────────────────────
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found.`,
      code: 'ROUTE_NOT_FOUND',
    });
  });

  // ── Centralized Error Handler (must be last) ───────────────────────────────
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
