import path from "path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

type EmailDraft = {
  subject: string;
  body: string;
};

export type WorkflowResult = {
  summary: string;
  actionItems: string[];
  followUpEmail: EmailDraft;
};

function extractTextFromToolResult(result: unknown): string {
  const toolResult = result as {
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  };

  const textBlock = toolResult.content?.find((item) => item.type === "text");

  if (!textBlock?.text) {
    throw new Error("MCP tool did not return text.");
  }

  return textBlock.text;
}

function extractJson(text: string) {
  const firstBracket = text.search(/[\[{]/);
  const lastCurly = text.lastIndexOf("}");
  const lastSquare = text.lastIndexOf("]");
  const lastBracket = Math.max(lastCurly, lastSquare);

  if (firstBracket === -1 || lastBracket === -1) {
    throw new Error("Could not find JSON in MCP tool response.");
  }

  return text.slice(firstBracket, lastBracket + 1);
}

function validateActionItems(data: unknown): string[] {
  if (!Array.isArray(data)) {
    throw new Error("Action items must be an array.");
  }

  if (!data.every((item) => typeof item === "string")) {
    throw new Error("Each action item must be a string.");
  }

  return data;
}

function validateEmailDraft(data: unknown): EmailDraft {
  if (
    typeof data !== "object" ||
    data === null ||
    !("subject" in data) ||
    !("body" in data)
  ) {
    throw new Error("Email draft returned the wrong shape.");
  }

  const email = data as EmailDraft;

  if (typeof email.subject !== "string" || typeof email.body !== "string") {
    throw new Error("Email draft fields are invalid.");
  }

  return email;
}

export async function runNotesWorkflowThroughMcp(
  notes: string
): Promise<WorkflowResult> {
  const serverPath = path.join(process.cwd(), "mcp-server", "notes-server.ts");

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", serverPath],
    env: {
      ...process.env,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
      ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5"
    }
  });

  const client = new Client({
    name: "solux-workflow-client",
    version: "1.0.0"
  });

  try {
    await client.connect(transport);

    const summaryResult = await client.callTool({
      name: "summarize_notes",
      arguments: {
        notes
      }
    });

    const summary = extractTextFromToolResult(summaryResult);

    const actionItemsResult = await client.callTool({
      name: "extract_action_items",
      arguments: {
        notes
      }
    });

    const actionItemsText = extractTextFromToolResult(actionItemsResult);
    const actionItemsJson = JSON.parse(extractJson(actionItemsText));
    const actionItems = validateActionItems(actionItemsJson);

    const emailResult = await client.callTool({
      name: "draft_follow_up_email",
      arguments: {
        notes,
        summary,
        actionItems
      }
    });

    const emailText = extractTextFromToolResult(emailResult);
    const emailJson = JSON.parse(extractJson(emailText));
    const followUpEmail = validateEmailDraft(emailJson);

    return {
      summary,
      actionItems,
      followUpEmail
    };
  } finally {
    await client.close();
  }
}