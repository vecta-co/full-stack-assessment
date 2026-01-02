# Maintenance AI Agent

A take-home assessment for building an AI-powered maintenance support agent. The goal is to create an intelligent assistant that can handle tenant maintenance requests — understanding issues, providing self-help guidance when appropriate, and coordinating professional help when needed.

This tests your ability to design and implement an AI agent that reasons about problems, retrieves relevant information, takes actions through tools, and handles real-world complexity.

## What This Is

A barebones starting point — a React chat interface and a simple Express API. There is no AI logic or pre-built architecture.

**You build everything.**

## What We're Looking For

| Area | What We're Evaluating |
|------|----------------------|
| **Information Retrieval** | How do you query and retrieve from knowledge sources (documents, policies, etc.)? |
| **Context & Memory** | How do you manage conversation context and maintain state across interactions? |
| **Agent Workflow** | How do you structure the agent's reasoning and decision-making process? |
| **Tool Use** | How does the agent use tools to take actions and gather information? |
| **Evaluation & Monitoring** | How do you measure and monitor the agent's performance? |
| **UI** | How do you show relevant information to the user about the agent or its outputs? |

## The Business Problem

You're building an AI agent for a property management company that handles tenant maintenance requests.

**Tenants message in with issues like:**
- "My smoke alarm won't stop beeping"
- "There's water coming through my ceiling"  
- "I've locked myself out"
- "The boiler pressure is too low"

### What the Agent Should Do

**1. Collect Information**
The agent should gather enough context from the tenant to understand the issue — what's happening, where, how urgent, etc.

**2. Try to Auto-Resolve**
Some issues have simple fixes that tenants can do themselves (e.g., resetting a tripped circuit breaker, repressurising a boiler). The agent should check the knowledge base and guide the tenant through self-resolution when possible.

**3. Escalate When Needed**
If the issue can't be self-resolved, escalate to the appropriate property manager. The tenant will receive a direct call from them. The system should:
- Find the right property manager based on the tenant's building
- Create an escalation record
- Inform the tenant that they'll receive a call

## Repo Structure

```
maintenance-ai-agent/
├── client/                 # React frontend
│   └── src/
│       ├── App.tsx         # Chat interface
│       ├── main.tsx
│       └── styles.css
├── db/                     # Data files (explore these!)
│   ├── knowledge.json
│   ├── tenants.json
│   ├── property_managers.json
│   └── escalations.json
├── server.js               # Express API
├── package.json
└── README.md
```

Explore the `db/` folder to understand what data is available. The chat interface is ready for you to wire up.

## Terminology

| Term | Description |
|------|-------------|
| **Tenant** | A resident who rents a property unit. They report maintenance issues and interact with the AI agent. |
| **Property Manager** | The person responsible for overseeing buildings and units. When an issue is escalated, they call the tenant directly to help resolve it. |
| **Escalation** | A record created when an issue requires human intervention. Contains the issue details, assigned property manager, and status. |
| **Knowledge** | A collection of guides, policies, and troubleshooting articles. Used by the agent to help tenants self-resolve common issues before escalating. |

## Getting Started

```bash
npm run install:all
npm run dev
```

- **API**: http://localhost:3001
- **Frontend**: http://localhost:5173

## What You Can Use

- Any AI/LLM provider
- Any frameworks or libraries  
- Extend or replace anything in the codebase

## Questions?

Make reasonable assumptions and document them. Good luck!
