**AI Workflow Automator**

A mini AI workflow automation project built for Solux Tech to demonstrate concepts learned from the Anthropic training program, including Claude API integration, structured prompting, MCP tool design, and workflow automation.

**Overview**

The AI Workflow Automator turns raw meeting notes into structured business outputs.

The user pastes meeting notes into the app, runs the workflow, and receives:

* A concise meeting summary
* A clear list of action items
* A professional follow-up email draft

The project is designed to show how AI can move beyond a basic chatbot and support repeatable business workflows.

**Tech Stack**

* Next.js
* TypeScript
* Claude API
* Anthropic SDK
* Model Context Protocol SDK
* Custom local MCP server
* Tailwind CSS

**How It Works**

The application follows this workflow:

Frontend UI
   ↓
Next.js API Route
   ↓
MCP Client
   ↓
Custom MCP Server
   ↓
Claude API
   ↓
Summary + Action Items + Follow-Up Email Draft

**Project Structure**

solux-workflow-automator
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       └── process-notes/
│           └── route.ts
│
├── lib/
│   └── mcpClient.ts
│
├── mcp-server/
│   └── notes-server.ts
│
├── .env.example
├── package.json
└── .gitignore

**Key Files**

app/page.tsx

The main frontend interface. It includes the meeting notes input box, workflow button, output display, and page styling.

app/api/process-notes/route.ts

The backend API route. It receives the meeting notes from the frontend and starts the MCP workflow.

lib/mcpClient.ts

The MCP client. It connects the Next.js backend to the custom local MCP server and calls each workflow tool.

mcp-server/notes-server.ts

The custom MCP server. It exposes three tools:

* summarize_notes
* extract_action_items
* draft_follow_up_email

Each tool uses Claude to generate a specific part of the final output.

**MCP Tools**

summarize_notes

Turns raw meeting notes into a concise business summary.

extract_action_items

Extracts clear action items and next steps from the notes.

draft_follow_up_email

Creates a professional follow-up email draft using the summary and action items.

**Skills Demonstrated**

This project demonstrates:

* Claude API integration
* Prompt engineering
* Structured JSON outputs
* MCP client-server architecture
* Tool-based workflow design
* Human-in-the-loop AI design
* Full-stack application development with Next.js

**Environment Variables**

Create a .env.local file in the root of the project:

ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-5

The real .env.local file is ignored by Git to keep API keys secure.

**Getting Started**

Install dependencies:

npm install

Run the development server:

npm run dev

Open the app:

http://localhost:3000

**Future Improvements**

Potential next steps include:

* Connect Gmail MCP to create real email drafts
* Connect Calendar MCP to pull meeting context automatically
* Connect File MCP to read meeting notes from uploaded documents
* Add Slack or Teams integration
* Add approval workflows before sending or updating anything
* Deploy the app as a hosted internal tool

**Purpose**

This project was built as a focused mini project to demonstrate how Claude and MCP can be used to create structured AI systems that complete practical workplace workflows.
