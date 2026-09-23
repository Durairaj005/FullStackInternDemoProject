'use strict';

const config = require('./src/config/env');
const connectDB = require('./src/config/db');
const createApp = require('./src/app');

/**
 * HTTP Server Entry Point
 *
 * Separated from app.js so that:
 * 1. Tests can import app.js directly without starting the server
 * 2. The server startup sequence is clear and observable
 */
const startServer = async () => {
  // 1. Connect to database first — app cannot start without DB
  await connectDB();

  // 2. Create Express app
  const app = createApp();

  // 3. Start HTTP server
  const server = app.listen(config.port, () => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  Feedants API Server`);
    console.log(`  Port    : ${config.port}`);
    console.log(`  Env     : ${config.nodeEnv}`);
    console.log(`  Health  : http://localhost:${config.port}/health`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  });

  // 4. Graceful shutdown — ensures in-flight requests complete before exit
  const shutdown = async (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      const mongoose = require('mongoose');
      await mongoose.disconnect();
      console.log('[Server] MongoDB disconnected. Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // 5. Handle unhandled promise rejections (catch-all safety net)
  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });
};

startServer();
