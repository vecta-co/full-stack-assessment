/**
 * Maintenance AI Agent - Server Entry Point
 * 
 * This is the main server file that sets up the Express application
 * and routes for the Maintenance Support AI Agent system.
 * 
 * The server provides:
 * - POST /messages - Process customer messages through the AI agent pipeline
 * - GET /messages/test-messages - Retrieve test messages for the UI
 * - GET /messages/knowledge-base - Inspect the knowledge base
 * - GET /messages/teams - Inspect available teams
 */

import express from 'express';
import cors from 'cors';
import messagesRouter from './routes/messages.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/messages', messagesRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Maintenance AI Agent API',
    version: '1.0.0',
    endpoints: {
      'POST /messages': 'Process a customer message',
      'GET /messages/test-messages': 'Get list of test messages',
      'GET /messages/knowledge-base': 'Get knowledge base entries',
      'GET /messages/teams': 'Get available teams',
      'GET /health': 'Health check',
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║       Maintenance AI Agent Server                         ║
║                                                           ║
║   Server running at: http://localhost:${PORT}              ║
║                                                           ║
║   Available endpoints:                                    ║
║   • POST /messages          - Process customer message    ║
║   • GET  /messages/test-messages - List test messages     ║
║   • GET  /messages/knowledge-base - View knowledge base   ║
║   • GET  /messages/teams    - View available teams        ║
║   • GET  /health            - Health check                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

