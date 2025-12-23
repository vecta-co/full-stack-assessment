/**
 * Knowledge Resolver Agent
 * 
 * This agent attempts to resolve customer issues using the knowledge base.
 * It matches the analyzed issue against pre-approved responses and determines
 * if automatic resolution is appropriate.
 * 
 * CRITICAL SAFETY RULE: Unsafe issues must NEVER be auto-resolved.
 * When in doubt, escalate to a human.
 */

import type { IssueAnalysis, ResolutionResult, KnowledgeBaseItem } from '../types/index.js';

/**
 * Attempts to resolve an issue using the knowledge base.
 * 
 * @param analysis - The issue analysis from the Issue Analyzer Agent
 * @param knowledgeBase - Available knowledge base entries
 * @returns Resolution result indicating success or failure
 * 
 * TODO: This function should implement careful decision-making about
 * when it's appropriate to auto-resolve vs. escalate. Consider:
 * 
 * 1. SAFETY-FIRST APPROACH:
 *    - NEVER auto-resolve issues marked as "unsafe" in the knowledge base
 *    - Even "caution" level issues should require higher confidence
 *    - When the message indicates potential safety concerns, escalate
 * 
 * 2. CONFIDENCE THRESHOLDS:
 *    - Each KB entry has a minimumConfidence requirement
 *    - The analysis confidence must meet or exceed this threshold
 *    - Consider adding a buffer (e.g., require 10% higher confidence)
 *    - Low confidence should ALWAYS result in escalation
 * 
 * 3. MATCHING QUALITY:
 *    - How well does the issue match the knowledge base entry?
 *    - Are there multiple potential matches? If so, be cautious.
 *    - Is the match based on strong signals or weak ones?
 * 
 * 4. CUSTOMER EXPERIENCE:
 *    - A wrong auto-response is worse than no response
 *    - Customers expect accuracy over speed
 *    - If in doubt, escalate and let a human respond
 * 
 * 5. EDGE CASES TO HANDLE:
 *    - Message mentions multiple issues
 *    - Issue partially matches multiple KB entries
 *    - Analysis confidence is borderline
 *    - Customer seems distressed or frustrated
 */
export function attemptResolution(
  analysis: IssueAnalysis,
  knowledgeBase: KnowledgeBaseItem[]
): ResolutionResult {
  // TODO: Implement robust matching logic
  // The current implementation is a basic placeholder that demonstrates
  // the expected decision flow but lacks proper safety checks
  
  // Step 1: Find potential matches in the knowledge base
  const matches = findMatchingEntries(analysis, knowledgeBase);
  
  if (matches.length === 0) {
    return {
      resolved: false,
      reason: 'No matching knowledge base entries found for this issue.',
    };
  }
  
  // Step 2: Select the best match
  // TODO: Implement proper ranking when multiple matches exist
  const bestMatch = matches[0];
  
  // Step 3: Safety check - NEVER auto-resolve unsafe issues
  // TODO: This check is critical. Consider what other safety signals
  // might exist in the analysis that should prevent auto-resolution.
  if (bestMatch.entry.safetyLevel === 'unsafe') {
    return {
      resolved: false,
      reason: `Safety level "${bestMatch.entry.safetyLevel}" requires human handling. Issue will be escalated.`,
    };
  }
  
  // Step 4: Confidence check
  // TODO: Consider implementing more nuanced confidence requirements
  // based on issue category, customer history, time of day, etc.
  const requiredConfidence = bestMatch.entry.minimumConfidence;
  
  if (analysis.confidence < requiredConfidence) {
    return {
      resolved: false,
      reason: `Confidence (${(analysis.confidence * 100).toFixed(0)}%) is below the required threshold (${(requiredConfidence * 100).toFixed(0)}%) for auto-resolution.`,
    };
  }
  
  // Step 5: Additional caution for "caution" level issues
  // TODO: Implement additional checks for caution-level issues
  if (bestMatch.entry.safetyLevel === 'caution') {
    // For caution-level issues, require higher confidence
    const cautionThreshold = requiredConfidence + 0.1;
    if (analysis.confidence < cautionThreshold) {
      return {
        resolved: false,
        reason: `Caution-level issue requires higher confidence. Current: ${(analysis.confidence * 100).toFixed(0)}%, Required: ${(cautionThreshold * 100).toFixed(0)}%.`,
      };
    }
  }
  
  // Step 6: Return successful resolution
  // TODO: Consider personalizing the response or adding context
  return {
    resolved: true,
    response: bestMatch.entry.approvedResponse,
    confidence: analysis.confidence,
    knowledgeBaseEntryId: bestMatch.entry.id,
  };
}

/**
 * Represents a match between analysis and a knowledge base entry.
 */
interface KnowledgeMatch {
  entry: KnowledgeBaseItem;
  matchScore: number;
  matchedKeywords: string[];
}

/**
 * Finds knowledge base entries that match the issue analysis.
 * 
 * TODO: Implement proper matching that considers:
 * - Keyword overlap
 * - Category matching
 * - Semantic similarity (without AI libraries - use keyword proximity, etc.)
 * - Match confidence scoring
 */
function findMatchingEntries(
  analysis: IssueAnalysis,
  knowledgeBase: KnowledgeBaseItem[]
): KnowledgeMatch[] {
  const matches: KnowledgeMatch[] = [];
  const messageWords = analysis.extractedKeywords.map(k => k.toLowerCase());
  const messageLower = analysis.originalMessage.toLowerCase();
  
  for (const entry of knowledgeBase) {
    // Check category match
    if (entry.category !== analysis.category) {
      continue;
    }
    
    // Check keyword matches
    const matchedKeywords = entry.keywords.filter(keyword =>
      messageLower.includes(keyword.toLowerCase())
    );
    
    if (matchedKeywords.length === 0) {
      continue;
    }
    
    // Calculate a simple match score
    // TODO: Implement a more sophisticated scoring algorithm
    const keywordScore = matchedKeywords.length / entry.keywords.length;
    const matchScore = keywordScore * analysis.confidence;
    
    matches.push({
      entry,
      matchScore,
      matchedKeywords,
    });
  }
  
  // Sort by match score descending
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  return matches;
}

