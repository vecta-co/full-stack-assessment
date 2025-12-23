# Maintenance AI Agent

A take-home assessment scaffold for building a Maintenance Support AI Agent.

## Overview

This project simulates an AI-powered customer support system for property maintenance. The system:

1. **Receives** customer messages (simulated as emails)
2. **Analyzes** the issue using pattern matching and heuristics
3. **Attempts resolution** using a knowledge base of pre-approved responses
4. **Escalates** unresolved issues to the appropriate internal team

> ⚠️ **Important**: This is a **scaffold**, not a finished solution. Candidates are expected to implement the core agent logic.

## System Architecture

```
┌─────────────────┐     ┌─────────────────────────────────────────────┐
│                 │     │                  Server                     │
│   React Client  │────▶│  ┌─────────────────────────────────────┐   │
│   (Debug UI)    │     │  │           POST /messages             │   │
│                 │◀────│  └─────────────────────────────────────┘   │
└─────────────────┘     │                    │                        │
                        │                    ▼                        │
                        │  ┌─────────────────────────────────────┐   │
                        │  │         Issue Analyzer Agent        │   │
                        │  │  • Categorize issue                 │   │
                        │  │  • Assess urgency                   │   │
                        │  │  • Extract signals                  │   │
                        │  └─────────────────────────────────────┘   │
                        │                    │                        │
                        │                    ▼                        │
                        │  ┌─────────────────────────────────────┐   │
                        │  │      Knowledge Resolver Agent       │   │
                        │  │  • Match against knowledge base     │   │
                        │  │  • Check safety level               │   │
                        │  │  • Validate confidence              │   │
                        │  └─────────────────────────────────────┘   │
                        │                    │                        │
                        │         Resolved?  │                        │
                        │           ╱        ╲                        │
                        │         YES        NO                       │
                        │          │          │                       │
                        │          ▼          ▼                       │
                        │  ┌────────────┐ ┌─────────────────────┐    │
                        │  │  Response  │ │   Triage Agent      │    │
                        │  │  Sent      │ │   • Select team     │    │
                        │  └────────────┘ │   • Set priority    │    │
                        │                 └─────────────────────┘    │
                        └─────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone or unzip the repository
cd maintenance-ai-agent

# Install all dependencies (server + client)
npm run install:all
```

### Running the Application

```bash
# Start both server and client in development mode
npm run dev
```

This will start:
- **Server**: http://localhost:3001
- **Client**: http://localhost:5173

### Using the Debug UI

1. Open http://localhost:5173 in your browser
2. Select a test message from the dropdown (or write a custom message)
3. Click "Process Message"
4. Observe the agent's analysis, decision, and outcome

## Project Structure

```
maintenance-ai-agent/
├── package.json              # Root package.json with scripts
├── tsconfig.json             # TypeScript configuration
├── README.md                 # This file
├── server/
│   ├── index.ts              # Express server entry point
│   ├── routes/
│   │   └── messages.ts       # POST /messages endpoint
│   ├── agents/
│   │   ├── issueAnalyzer.ts      # Issue classification agent
│   │   ├── knowledgeResolver.ts  # Knowledge base resolution agent
│   │   └── triageAgent.ts        # Escalation routing agent
│   ├── data/
│   │   ├── knowledgeBase.json    # Pre-approved responses
│   │   ├── teams.json            # Internal teams
│   │   └── testMessages.json     # Sample customer messages
│   └── types/
│       └── index.ts          # Shared TypeScript types
├── client/
│   ├── index.html
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx           # Debug UI component
│   │   ├── api.ts            # API client
│   │   └── styles.css
│   └── public/
└── .gitignore
```

## API Reference

### `POST /messages`

Process a customer message through the AI agent pipeline.

**Request:**
```json
{
  "messageId": "msg-001",
  "messageText": "My boiler pressure is very low..."
}
```

**Response:**
```json
{
  "issueAnalysis": {
    "category": "heating",
    "urgency": "medium",
    "confidence": 0.75,
    "extractedKeywords": ["boiler", "pressure"],
    "signals": [...],
    "originalMessage": "..."
  },
  "resolution": {
    "resolved": true,
    "response": "Thank you for reporting...",
    "confidence": 0.75,
    "knowledgeBaseEntryId": "kb-001"
  },
  "escalation": null,
  "agentDecisionSummary": "..."
}
```

### `GET /messages/test-messages`

Returns the list of test messages for the UI.

### `GET /messages/knowledge-base`

Returns the knowledge base entries (for debugging).

### `GET /messages/teams`

Returns the list of available teams (for debugging).

---

## Candidate Instructions

### What You Need to Implement

The scaffold provides basic placeholder logic. Your task is to implement robust decision-making in the three agent files:

#### 1. Issue Analyzer (`server/agents/issueAnalyzer.ts`)

**Current state:** Basic keyword matching with hardcoded confidence values.

**Your task:**
- Implement proper keyword extraction and weighting
- Build a confidence scoring system based on signal quality
- Handle ambiguous messages appropriately
- Consider edge cases (multiple issues, unknown categories, etc.)

**Key questions to consider:**
- How do you handle messages that could fit multiple categories?
- What makes you confident in a classification?
- How should you handle short or vague messages?

#### 2. Knowledge Resolver (`server/agents/knowledgeResolver.ts`)

**Current state:** Simple category matching with basic safety checks.

**Your task:**
- Implement robust knowledge base matching
- Build proper confidence threshold logic
- Ensure unsafe issues are NEVER auto-resolved
- Handle cases where multiple KB entries might match

**Key questions to consider:**
- When is it safe to auto-respond vs. escalate?
- How do you handle borderline confidence scores?
- What additional safety signals should prevent auto-resolution?

#### 3. Triage Agent (`server/agents/triageAgent.ts`)

**Current state:** Basic category-to-team mapping.

**Your task:**
- Implement intelligent team routing
- Handle priority assignment based on multiple factors
- Ensure emergency situations are routed appropriately
- Provide useful context for the receiving team

**Key questions to consider:**
- When multiple teams could handle an issue, how do you choose?
- How do you ensure critical issues get urgent priority?
- What information does the receiving team need?

### What Is Intentionally Incomplete

1. **Smart matching algorithms** - You decide the approach
2. **Confidence calibration** - Current values are arbitrary
3. **Edge case handling** - Many scenarios need special logic
4. **Safety heuristics** - Beyond the basic "unsafe" flag
5. **Escalation reasoning** - Could be much more informative

### Constraints

- **No AI/LLM libraries** - No OpenAI, LangChain, Claude, etc.
- **Implement logic yourself** - Use pattern matching, heuristics, rules
- **Keep dependencies minimal** - Use only what's already included
- **TypeScript throughout** - Maintain type safety

---

## What We're Evaluating

### Decision-Making Quality

- Does the system make sensible choices?
- Are edge cases handled thoughtfully?
- Is the logic explainable and debuggable?

### Safety First

- Are unsafe issues correctly identified?
- Does low confidence lead to escalation?
- Is the system conservative when uncertain?

### Code Clarity

- Is the code readable and well-organized?
- Are decisions documented with comments?
- Could another developer understand the logic?

### Tradeoff Awareness

- Speed vs. accuracy considerations
- False positive vs. false negative awareness
- User experience vs. safety balance

### Technical Execution

- Proper TypeScript usage
- Error handling
- Code structure and organization

---

## Test Messages

The `testMessages.json` includes various scenarios:

| ID | Type | Expected Behavior |
|---|---|---|
| msg-001 | Low boiler pressure | Should resolve (KB match) |
| msg-002 | Gas smell (emergency) | Must escalate immediately |
| msg-003 | Smoke alarm beeping | Should resolve (battery) |
| msg-004 | Partial power outage | Should resolve (breaker) |
| msg-005 | Locked out | Must escalate (access team) |
| msg-006 | Running toilet | Should resolve (KB match) |
| msg-007 | Service charge question | Must escalate (accounts) |
| msg-008 | Washing machine issue | Should resolve (filter) |
| msg-009 | Vague heating complaint | Should escalate (ambiguous) |
| msg-010 | Crack in wall | Must escalate (structural) |

---

## Tips for Candidates

1. **Read the code first** - Understand what exists before writing
2. **Start with safety** - Get the critical path right first
3. **Test edge cases** - Use the test messages and create your own
4. **Document decisions** - Explain why, not just what
5. **Keep it simple** - Clever solutions are harder to debug
6. **Think like a user** - What would you expect as a customer?

---

## Time Expectation

This assessment is designed for **3-4 hours** of focused work. You don't need to build a perfect system - we want to see how you think about problems.

Prioritize:
1. Safety logic (must work correctly)
2. Core classification (good enough)
3. Edge case handling (demonstrate awareness)
4. Polish (if time permits)

---

## Questions?

If anything is unclear about the requirements, make reasonable assumptions and document them in your code comments or a brief write-up.

Good luck! 🛠️
