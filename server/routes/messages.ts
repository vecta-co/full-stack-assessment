/**
 * Messages Route Handler
 * 
 * Handles the POST /messages endpoint which processes incoming
 * customer messages through the AI agent pipeline.
 */

import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { analyzeIssue } from '../agents/issueAnalyzer.js';
import { attemptResolution } from '../agents/knowledgeResolver.js';
import { triageIssue } from '../agents/triageAgent.js';
import type {
  MessageRequest,
  MessageResponse,
  KnowledgeBaseItem,
  Team,
  TestMessage,
} from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load static data
const knowledgeBase: KnowledgeBaseItem[] = JSON.parse(
  readFileSync(join(__dirname, '../data/knowledgeBase.json'), 'utf-8')
);

const teams: Team[] = JSON.parse(
  readFileSync(join(__dirname, '../data/teams.json'), 'utf-8')
);

const testMessages: TestMessage[] = JSON.parse(
  readFileSync(join(__dirname, '../data/testMessages.json'), 'utf-8')
);

const router = Router();

/**
 * POST /messages
 * 
 * Processes a customer message through the AI agent pipeline:
 * 1. Issue Analyzer - classifies and extracts information
 * 2. Knowledge Resolver - attempts to auto-resolve using KB
 * 3. Triage Agent - routes to appropriate team if not resolved
 * 
 * Request body:
 *   - messageId: string - ID of the message
 *   - messageText: string - The customer's message content
 * 
 * Response:
 *   - issueAnalysis: Analysis results
 *   - resolution: Resolution if successful, null otherwise
 *   - escalation: Escalation info if not resolved, null otherwise
 *   - agentDecisionSummary: Human-readable decision explanation
 */
router.post('/', (req: Request, res: Response) => {
  const { messageId, messageText } = req.body as MessageRequest;
  
  // Validate request
  if (!messageId || !messageText) {
    res.status(400).json({
      error: 'Missing required fields: messageId and messageText are required.',
    });
    return;
  }
  
  try {
    // Step 1: Analyze the issue
    const issueAnalysis = analyzeIssue(messageText);
    
    // Step 2: Attempt to resolve using knowledge base
    const resolution = attemptResolution(issueAnalysis, knowledgeBase);
    
    // Step 3: If not resolved, triage for escalation
    let escalation = null;
    if (!resolution.resolved) {
      escalation = triageIssue(issueAnalysis, teams);
    }
    
    // Generate decision summary
    const agentDecisionSummary = generateDecisionSummary(
      issueAnalysis,
      resolution,
      escalation
    );
    
    const response: MessageResponse = {
      issueAnalysis,
      resolution,
      escalation,
      agentDecisionSummary,
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      error: 'An error occurred while processing the message.',
    });
  }
});

/**
 * GET /messages/test-messages
 * 
 * Returns the list of test messages for the UI dropdown.
 */
router.get('/test-messages', (_req: Request, res: Response) => {
  res.json(testMessages);
});

/**
 * GET /messages/knowledge-base
 * 
 * Returns the knowledge base for debugging/inspection.
 */
router.get('/knowledge-base', (_req: Request, res: Response) => {
  res.json(knowledgeBase);
});

/**
 * GET /messages/teams
 * 
 * Returns the teams list for debugging/inspection.
 */
router.get('/teams', (_req: Request, res: Response) => {
  res.json(teams);
});

/**
 * Generates a human-readable summary of the agent's decision process.
 */
function generateDecisionSummary(
  analysis: ReturnType<typeof analyzeIssue>,
  resolution: ReturnType<typeof attemptResolution>,
  escalation: ReturnType<typeof triageIssue> | null
): string {
  const parts: string[] = [];
  
  // Analysis summary
  parts.push(`ANALYSIS:`);
  parts.push(`Category: ${analysis.category}`);
  parts.push(`Urgency: ${analysis.urgency}`);
  parts.push(`Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);
  
  if (analysis.signals.length > 0) {
    const signalSummary = analysis.signals
      .map(s => s.value)
      .join(', ');
    parts.push(`Signals: ${signalSummary}`);
  }
  
  parts.push('');
  
  // Resolution/Escalation outcome
  if (resolution.resolved) {
    parts.push(`RESOLUTION:`);
    parts.push(`Agent resolved this issue automatically.`);
    parts.push(`Knowledge base entry: ${resolution.knowledgeBaseEntryId}`);
    parts.push(`Response confidence: ${(resolution.confidence * 100).toFixed(0)}%`);
  } else {
    parts.push(`ESCALATION:`);
    parts.push(`Reason: ${resolution.reason}`);
    
    if (escalation) {
      parts.push(`Routed to: ${escalation.teamName}`);
      parts.push(`Priority: ${escalation.priority}`);
      parts.push(`Routing reason: ${escalation.reason}`);
    }
  }
  
  return parts.join('\n');
}

export default router;

