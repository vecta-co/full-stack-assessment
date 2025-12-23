/**
 * API Client for the Maintenance AI Agent
 * 
 * Provides typed functions for interacting with the backend API.
 */

const API_BASE = '';

/**
 * Test message from the backend
 */
export interface TestMessage {
  id: string;
  subject: string;
  body: string;
}

/**
 * Issue analysis from the AI agent
 */
export interface IssueAnalysis {
  category: string;
  urgency: string;
  confidence: number;
  extractedKeywords: string[];
  signals: Array<{
    type: string;
    value: string;
    weight: number;
  }>;
  originalMessage: string;
}

/**
 * Resolution result from the knowledge resolver
 */
export type ResolutionResult =
  | {
      resolved: true;
      response: string;
      confidence: number;
      knowledgeBaseEntryId: string;
    }
  | {
      resolved: false;
      reason: string;
    };

/**
 * Escalation decision from the triage agent
 */
export interface Escalation {
  teamId: string;
  teamName: string;
  priority: string;
  reason: string;
}

/**
 * Full response from the /messages endpoint
 */
export interface MessageResponse {
  issueAnalysis: IssueAnalysis;
  resolution: ResolutionResult | null;
  escalation: Escalation | null;
  agentDecisionSummary: string;
}

/**
 * Fetches the list of test messages from the server.
 */
export async function fetchTestMessages(): Promise<TestMessage[]> {
  const response = await fetch(`${API_BASE}/messages/test-messages`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch test messages: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Sends a message to be processed by the AI agent.
 */
export async function processMessage(
  messageId: string,
  messageText: string
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messageId, messageText }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to process message: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Checks the server health.
 */
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE}/health`);
  
  if (!response.ok) {
    throw new Error('Server health check failed');
  }
  
  return response.json();
}

