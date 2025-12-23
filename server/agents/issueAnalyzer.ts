/**
 * Issue Analyzer Agent
 * 
 * This agent is responsible for analyzing incoming customer messages
 * and extracting structured information about the maintenance issue.
 * 
 * The analysis should include:
 * - Issue categorization
 * - Urgency assessment
 * - Confidence scoring
 * - Signal extraction (keywords, phrases, context clues)
 */

import type { IssueAnalysis, IssueCategory, UrgencyLevel, AnalysisSignal } from '../types/index.js';

/**
 * Analyzes a customer message to extract issue information.
 * 
 * @param message - The raw customer message text
 * @returns Analysis results including category, urgency, and extracted signals
 * 
 * TODO: This function currently uses very basic keyword matching.
 * Candidates should implement more sophisticated analysis that:
 * 
 * 1. DETERMINISTIC MATCHING:
 *    - Implement keyword extraction and matching
 *    - Consider word proximity (e.g., "gas" near "smell" is more concerning than "gas" near "cooking")
 *    - Handle synonyms and variations (e.g., "boiler", "furnace", "heating system")
 * 
 * 2. CONFIDENCE SCORING:
 *    - Calculate confidence based on number and quality of signals
 *    - Multiple matching signals should increase confidence
 *    - Ambiguous or conflicting signals should decrease confidence
 *    - Consider implementing a scoring formula that accounts for signal weights
 * 
 * 3. URGENCY DETECTION:
 *    - Look for urgency indicators: "urgent", "emergency", "ASAP", "!!!"
 *    - Safety-related keywords should automatically increase urgency
 *    - Time-sensitive language should be detected
 * 
 * 4. EDGE CASES:
 *    - What if the message matches multiple categories?
 *    - What if no clear category can be determined?
 *    - How should very short or very long messages be handled?
 * 
 * 5. SAFETY CONSIDERATIONS:
 *    - Always err on the side of caution for potential safety issues
 *    - Low confidence on safety-related issues should still escalate
 */
export function analyzeIssue(message: string): IssueAnalysis {
  const lowerMessage = message.toLowerCase();
  
  // TODO: Replace this simplistic implementation with robust analysis
  // This placeholder demonstrates the expected structure but lacks
  // the nuanced decision-making candidates should implement
  
  const signals: AnalysisSignal[] = [];
  let category: IssueCategory = 'unknown';
  let urgency: UrgencyLevel = 'medium';
  let confidence = 0.5;
  
  // Basic keyword extraction
  const keywords = extractKeywords(lowerMessage);
  
  // Simple category detection (placeholder logic)
  // TODO: Implement proper category detection with confidence weighting
  if (containsAny(lowerMessage, ['gas', 'smell gas', 'gas leak'])) {
    category = 'safety';
    urgency = 'critical';
    confidence = 0.9;
    signals.push({ type: 'keyword', value: 'gas-related', weight: 1.0 });
  } else if (containsAny(lowerMessage, ['boiler', 'heating', 'radiator', 'pressure'])) {
    category = 'heating';
    confidence = 0.7;
    signals.push({ type: 'keyword', value: 'heating-related', weight: 0.8 });
  } else if (containsAny(lowerMessage, ['electric', 'power', 'fuse', 'circuit', 'lights'])) {
    category = 'electrical';
    confidence = 0.7;
    signals.push({ type: 'keyword', value: 'electrical-related', weight: 0.8 });
  } else if (containsAny(lowerMessage, ['toilet', 'tap', 'water', 'drain', 'pipe', 'plumb'])) {
    category = 'plumbing';
    confidence = 0.7;
    signals.push({ type: 'keyword', value: 'plumbing-related', weight: 0.8 });
  } else if (containsAny(lowerMessage, ['smoke alarm', 'smoke detector', 'fire alarm', 'beeping'])) {
    category = 'safety';
    confidence = 0.75;
    signals.push({ type: 'keyword', value: 'safety-device', weight: 0.85 });
  } else if (containsAny(lowerMessage, ['fob', 'key', 'locked out', 'door', 'access'])) {
    category = 'access';
    confidence = 0.7;
    signals.push({ type: 'keyword', value: 'access-related', weight: 0.8 });
  } else if (containsAny(lowerMessage, ['washing machine', 'dishwasher', 'appliance', 'dryer'])) {
    category = 'appliance';
    confidence = 0.7;
    signals.push({ type: 'keyword', value: 'appliance-related', weight: 0.8 });
  } else if (containsAny(lowerMessage, ['crack', 'structural', 'ceiling', 'wall damage', 'subsidence'])) {
    category = 'structural';
    urgency = 'high';
    confidence = 0.6;
    signals.push({ type: 'keyword', value: 'structural-concern', weight: 0.7 });
  } else if (containsAny(lowerMessage, ['charge', 'payment', 'bill', 'invoice', 'account'])) {
    category = 'general';
    confidence = 0.65;
    signals.push({ type: 'keyword', value: 'account-related', weight: 0.7 });
  }
  
  // Urgency modifiers
  // TODO: Implement more nuanced urgency detection
  if (containsAny(lowerMessage, ['urgent', 'emergency', 'asap', 'immediately', '!!!', 'help'])) {
    if (urgency !== 'critical') {
      urgency = 'high';
    }
    signals.push({ type: 'sentiment', value: 'urgency-indicator', weight: 0.9 });
  }
  
  // Confidence adjustments based on message characteristics
  // TODO: Implement proper confidence calibration
  if (message.length < 20) {
    confidence *= 0.7; // Short messages are harder to classify
    signals.push({ type: 'context', value: 'short-message', weight: -0.3 });
  }
  
  if (message.includes('?') && message.split('?').length > 2) {
    confidence *= 0.8; // Multiple questions indicate ambiguity
    signals.push({ type: 'context', value: 'multiple-questions', weight: -0.2 });
  }
  
  return {
    category,
    urgency,
    confidence: Math.min(Math.max(confidence, 0), 1), // Clamp to 0-1
    extractedKeywords: keywords,
    signals,
    originalMessage: message,
  };
}

/**
 * Extracts keywords from a message.
 * 
 * TODO: Implement proper keyword extraction that:
 * - Removes stop words
 * - Handles stemming/lemmatization
 * - Identifies multi-word phrases
 * - Ranks keywords by importance
 */
function extractKeywords(message: string): string[] {
  // Placeholder: just extract words longer than 4 characters
  const words = message
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4);
  
  return [...new Set(words)];
}

/**
 * Checks if text contains any of the given patterns.
 * 
 * TODO: Consider implementing fuzzy matching or semantic similarity
 */
function containsAny(text: string, patterns: string[]): boolean {
  return patterns.some(pattern => text.includes(pattern));
}

