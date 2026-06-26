import Anthropic from "@anthropic-ai/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const server = new McpServer({
  name: "solux-notes-workflow-server",
  version: "1.0.0"
});

async function askClaude(prompt: string) {
  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
    max_tokens: 1200,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const textBlock = message.content.find((block) => block.type === "text");

  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude did not return text.");
  }

  return textBlock.text.trim();
}

server.tool(
  "summarize_notes",
  "Summarizes raw meeting notes into one clear business paragraph.",
  {
    notes: z.string()
  },
  async ({ notes }) => {
    const summary = await askClaude(`
Summarize these meeting notes in one concise business paragraph.

Meeting notes:
${notes}
`);

    return {
      content: [
        {
          type: "text",
          text: summary
        }
      ]
    };
  }
);

server.tool(
  "extract_action_items",
  "Extracts clear action items from meeting notes.",
  {
    notes: z.string()
  },
  async ({ notes }) => {
    const actionItems = await askClaude(`
Extract clear action items from these meeting notes.

Return ONLY valid JSON in this format:
[
  "Action item 1",
  "Action item 2"
]

Meeting notes:
${notes}
`);

    return {
      content: [
        {
          type: "text",
          text: actionItems
        }
      ]
    };
  }
);

server.tool(
  "draft_follow_up_email",
  "Drafts a professional follow-up email.",
  {
    notes: z.string(),
    summary: z.string(),
    actionItems: z.array(z.string())
  },
  async ({ notes, summary, actionItems }) => {
    const email = await askClaude(`
Draft a professional follow-up email.

Return ONLY valid JSON in this format:
{
  "subject": "Email subject",
  "body": "Email body"
}

Summary:
${summary}

Action items:
${actionItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}

Original notes:
${notes}
`);

    return {
      content: [
        {
          type: "text",
          text: email
        }
      ]
    };
  }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
  
  main().catch((error) => {
    console.error("MCP server failed:", error);
    process.exit(1);
  });