/**
 * Triage Agent
 * 
 * This agent is responsible for routing escalated issues to the appropriate
 * internal team. It must make routing decisions based on issue analysis
 * and team capabilities.
 * 
 * IMPORTANT PRINCIPLE: Incorrect routing is worse than conservative escalation.
 * When uncertain, route to a team with broader capabilities or flag for review.
 */

import type { IssueAnalysis, Escalation, EscalationPriority, Team } from '../types/index.js';

/**
 * Determines which team should handle an escalated issue.
 * 
 * @param analysis - The issue analysis from the Issue Analyzer Agent
 * @param teams - Available teams that can receive escalations
 * @returns Escalation decision with team assignment and priority
 * 
 * TODO: This function needs careful implementation considering:
 * 
 * 1. ROUTING ACCURACY:
 *    - Match issue category to team capabilities
 *    - Consider team specializations
 *    - Handle cases where multiple teams could handle the issue
 * 
 * 2. PRIORITY ASSIGNMENT:
 *    - Map urgency levels to escalation priorities
 *    - Consider time-sensitive factors
 *    - Safety issues should always be high priority
 * 
 * 3. CONSERVATIVE DECISIONS:
 *    - If uncertain between teams, prefer the one with broader capabilities
 *    - Emergency teams can handle more but should be used sparingly
 *    - Wrong routing wastes customer time and team resources
 * 
 * 4. EMERGENCY HANDLING:
 *    - Critical urgency issues should route to emergency-capable teams
 *    - Safety-related issues may need emergency routing regardless of urgency
 *    - Consider time of day (after-hours might need different routing)
 * 
 * 5. FALLBACK BEHAVIOR:
 *    - What if no team matches the category?
 *    - What if the analysis category is "unknown"?
 *    - Always have a default routing path
 * 
 * 6. TRADEOFFS TO CONSIDER:
 *    - Speed vs. accuracy: Quick routing might be less accurate
 *    - Specialist vs. generalist: Specialists are better but less available
 *    - Customer experience: Multiple transfers are frustrating
 */
export function triageIssue(
  analysis: IssueAnalysis,
  teams: Team[]
): Escalation {
  // TODO: Implement robust team matching and priority assignment
  // The current implementation demonstrates the expected structure
  // but candidates should add proper decision logic
  
  // Step 1: Determine priority based on urgency and category
  const priority = determineEscalationPriority(analysis);
  
  // Step 2: Check if this is an emergency situation
  const isEmergency = analysis.urgency === 'critical' || analysis.category === 'safety';
  
  // Step 3: Find appropriate team(s)
  const eligibleTeams = findEligibleTeams(analysis, teams, isEmergency);
  
  // Step 4: Select the best team
  // TODO: Implement proper team selection when multiple teams are eligible
  const selectedTeam = selectBestTeam(eligibleTeams, analysis, isEmergency);
  
  // Step 5: Generate escalation reason
  // TODO: Make the reason more informative based on the analysis
  const reason = generateEscalationReason(analysis, selectedTeam, isEmergency);
  
  return {
    teamId: selectedTeam.id,
    teamName: selectedTeam.name,
    priority,
    reason,
  };
}

/**
 * Maps issue analysis to escalation priority.
 * 
 * TODO: Consider additional factors beyond just urgency:
 * - Category-specific priority rules
 * - Business hours vs. after-hours
 * - Customer tier/importance (if available)
 */
function determineEscalationPriority(analysis: IssueAnalysis): EscalationPriority {
  // Simple mapping - candidates should expand this
  switch (analysis.urgency) {
    case 'critical':
      return 'urgent';
    case 'high':
      return 'high';
    case 'medium':
      return 'normal';
    case 'low':
      return 'low';
    default:
      return 'normal';
  }
}

/**
 * Finds teams that can handle the given issue.
 * 
 * TODO: Implement more nuanced filtering:
 * - Prefer specialists when available
 * - Consider team workload if available
 * - Handle after-hours routing
 */
function findEligibleTeams(
  analysis: IssueAnalysis,
  teams: Team[],
  isEmergency: boolean
): Team[] {
  const eligible = teams.filter(team => {
    // Check if team handles this category
    const handlesCategory = 
      team.handlesCategories.includes(analysis.category) ||
      team.handlesCategories.includes('general');
    
    // For emergencies, only include emergency-capable teams
    if (isEmergency && !team.handlesEmergencies) {
      return false;
    }
    
    return handlesCategory;
  });
  
  return eligible;
}

/**
 * Selects the best team from eligible options.
 * 
 * TODO: Implement proper team selection logic:
 * - Prefer specialists over generalists
 * - Balance workload if metrics are available
 * - Consider team availability
 */
function selectBestTeam(
  eligibleTeams: Team[],
  analysis: IssueAnalysis,
  isEmergency: boolean
): Team {
  if (eligibleTeams.length === 0) {
    // TODO: This is a fallback. Consider having a default "catch-all" team.
    // For now, return a placeholder that indicates no team was found.
    // In production, this should probably alert someone.
    return {
      id: 'team-fallback',
      name: 'General Support',
      handlesCategories: ['general', 'unknown'],
      handlesEmergencies: true,
      contactInfo: 'support@property.example.com',
    };
  }
  
  // For emergencies, prefer emergency-capable teams
  if (isEmergency) {
    const emergencyTeam = eligibleTeams.find(t => t.handlesEmergencies);
    if (emergencyTeam) {
      return emergencyTeam;
    }
  }
  
  // Prefer the team whose primary category matches
  // TODO: Implement category priority/preference
  const primaryMatch = eligibleTeams.find(t => 
    t.handlesCategories[0] === analysis.category
  );
  
  if (primaryMatch) {
    return primaryMatch;
  }
  
  // Default to first eligible team
  return eligibleTeams[0];
}

/**
 * Generates a human-readable explanation for the escalation.
 * 
 * TODO: Make this more informative:
 * - Include key signals from the analysis
 * - Explain why this team was chosen
 * - Provide context for the receiving team
 */
function generateEscalationReason(
  analysis: IssueAnalysis,
  team: Team,
  isEmergency: boolean
): string {
  const parts: string[] = [];
  
  if (isEmergency) {
    parts.push('EMERGENCY ESCALATION:');
  }
  
  parts.push(`Issue categorized as "${analysis.category}" with ${analysis.urgency} urgency.`);
  
  if (analysis.confidence < 0.7) {
    parts.push(`Note: Classification confidence is low (${(analysis.confidence * 100).toFixed(0)}%).`);
  }
  
  parts.push(`Routed to ${team.name} team.`);
  
  return parts.join(' ');
}

