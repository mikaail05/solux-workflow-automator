import { NextResponse } from "next/server";
import { runNotesWorkflowThroughMcp } from "@/lib/mcpClient";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const notes = body.notes;

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(
        { error: "Please provide meeting notes." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Missing ANTHROPIC_API_KEY in .env.local." },
        { status: 500 }
      );
    }

    const result = await runNotesWorkflowThroughMcp(notes);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Workflow error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process notes through MCP."
      },
      { status: 500 }
    );
  }
}