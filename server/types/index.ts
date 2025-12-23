/**
 * Shared TypeScript types for the Maintenance AI Agent system.
 * 
 * These types define the contract between agents and ensure
 * consistent data structures throughout the application.
 */

/**
 * Represents the analysis result from the Issue Analyzer Agent.
 * Contains classification, urgency assessment, and extracted signals.
 */
export interface IssueAnalysis {
  /** The category of the maintenance issue */
  category: IssueCategory;
  
  /** How urgent is this issue? */
  urgency: UrgencyLevel;
  
  /** Confidence score for the analysis (0-1) */
  confidence: number;
  
  /** Keywords and phrases extracted from the message */
  extractedKeywords: string[];
  
  /** Specific signals that influenced the analysis */
  signals: AnalysisSignal[];
  
  /** The original message text */
  originalMessage: string;
}

/**
 * Categories of maintenance issues the system can identify.
 * 
 * TODO: Candidates may want to expand this enum based on
 * the knowledge base entries they analyze.
 */
export type IssueCategory =
  | 'heating'
  | 'electrical'
  | 'plumbing'
  | 'safety'
  | 'access'
  | 'appliance'
  | 'structural'
  | 'general'
  | 'unknown';

/**
 * Urgency levels for issue prioritization.
 */
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

/**
 * A signal extracted during message analysis.
 * Signals provide evidence for classification decisions.
 */
export interface AnalysisSignal {
  /** Type of signal detected */
  type: 'keyword' | 'phrase' | 'sentiment' | 'context';
  
  /** The actual value/text of the signal */
  value: string;
  
  /** How much this signal contributed to the decision (0-1) */
  weight: number;
}

/**
 * Result from the Knowledge Resolver Agent's attempt to resolve an issue.
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
 * Represents an escalation decision from the Triage Agent.
 */
export interface Escalation {
  /** The team this issue should be routed to */
  teamId: string;
  
  /** Human-readable team name */
  teamName: string;
  
  /** Priority level for the escalation */
  priority: EscalationPriority;
  
  /** Brief explanation of why this routing was chosen */
  reason: string;
}

export type EscalationPriority = 'urgent' | 'high' | 'normal' | 'low';

/**
 * An entry in the knowledge base.
 * These are pre-approved responses for common issues.
 */
export interface KnowledgeBaseItem {
  id: string;
  
  /** Category this entry applies to */
  category: IssueCategory;
  
  /** Keywords that should trigger this entry */
  keywords: string[];
  
  /** Brief description of the issue this addresses */
  issueDescription: string;
  
  /** The pre-approved response to send to the customer */
  approvedResponse: string;
  
  /** 
   * Safety level determines if auto-resolution is allowed.
   * "unsafe" issues must ALWAYS be escalated to a human.
   */
  safetyLevel: 'safe' | 'caution' | 'unsafe';
  
  /** 
   * Minimum confidence required to use this response.
   * If analysis confidence is below this, escalate instead.
   */
  minimumConfidence: number;
}

/**
 * Represents an internal team that can receive escalations.
 */
export interface Team {
  id: string;
  name: string;
  
  /** Categories of issues this team handles */
  handlesCategories: IssueCategory[];
  
  /** Can this team handle urgent/emergency issues? */
  handlesEmergencies: boolean;
  
  /** Contact method or additional routing info */
  contactInfo: string;
}

/**
 * A test message (simulated customer email).
 */
export interface TestMessage {
  id: string;
  subject: string;
  body: string;
}

/**
 * Request body for the POST /messages endpoint.
 */
export interface MessageRequest {
  messageId: string;
  messageText: string;
}

/**
 * Response body from the POST /messages endpoint.
 */
export interface MessageResponse {
  /** The analysis of the customer's issue */
  issueAnalysis: IssueAnalysis;
  
  /** Resolution if the agent could handle it, null otherwise */
  resolution: ResolutionResult | null;
  
  /** Escalation info if the issue was escalated, null otherwise */
  escalation: Escalation | null;
  
  /** 
   * Human-readable summary of the agent's decision-making process.
   * This helps with debugging and evaluation.
   */
  agentDecisionSummary: string;
}

