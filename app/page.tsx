"use client";

import { useState } from "react";

type WorkflowResult = {
  summary: string;
  actionItems: string[];
  followUpEmail: {
    subject: string;
    body: string;
  };
};

const sampleNotes = `Meeting Notes - Solux Tech Demo

Attendees: Betty, Zoe, Mikaail

The team discussed creating a small AI-native internal tool that demonstrates API usage and MCP-style workflow thinking.

Key points:
- Mikaail will build a mini workflow automator using Claude.
- The tool should take raw meeting notes and turn them into useful business outputs.
- The first version should summarize notes, extract action items, and draft a follow-up email.
- Gmail integration is a future improvement, but the MVP should keep human approval before sending emails.
- The demo should focus on showing how AI can complete a structured workflow rather than just answer one question.

Decisions:
- Keep the project lightweight.
- Build with Next.js, Claude API, and a custom MCP server.
- Finish a working local demo first before adding real integrations.

Action items:
- Mikaail will build the frontend.
- Mikaail will connect the Claude API.
- Mikaail will create a local MCP server.
- Mikaail will prepare a short demo script.
- Future version may connect Gmail, Calendar, or file MCP tools.`;

export default function Home() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runWorkflow() {
    try {
      setLoading(true);
      setResult(null);
      setError("");

      const response = await fetch("/api/process-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ notes })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function useSampleNotes() {
    setNotes(sampleNotes);
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#111111]">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <header className="mb-12 border-b border-[#d8d2c8] pb-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#6f6a63]">
                AI Workflow Automator by
              </p>
              <div className="mt-3">
                <h1 className="font-serif text-4xl tracking-[0.18em] text-[#111111]">
                  SOLUX TECH
                </h1>
                <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-[#6f6a63]">
                  Smarter foundations for smarter growth
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge>Claude API</Badge>
              <Badge>Custom MCP Server</Badge>
              <Badge>Next.js</Badge>
              <Badge>Workflow Automation</Badge>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-[#8a8177]">
                Solux Tech Mini Project
              </p>

              <h2 className="max-w-4xl font-serif text-5xl leading-tight tracking-tight text-[#111111] md:text-6xl">
                A workflow is a system.
                <span className="block italic text-[#6d665f]">
                  We automate it as one.
                </span>
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f5a54]">
                Paste raw meeting notes. A custom MCP server uses Claude to
                transform them into a business-ready summary, action items, and
                a follow-up email draft.
              </p>
            </div>

            <div className="border-l border-[#d8d2c8] pl-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8a8177]">
                What this demonstrates
              </p>
              <div className="mt-5 grid gap-3 text-sm text-[#4d4944]">
                <MiniPoint text="Claude API integration" />
                <MiniPoint text="MCP client-server architecture" />
                <MiniPoint text="Structured AI workflow outputs" />
                <MiniPoint text="Human-in-the-loop email drafting" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="border border-[#d8d2c8] bg-[#fbfaf7] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8a8177]">
                  Input
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                  Meeting Notes Input
                </h2>
                <p className="mt-1 text-sm text-[#6f6a63]">
                  Paste messy notes and run the MCP workflow.
                </p>
              </div>

              <button
                onClick={useSampleNotes}
                className="border border-[#cfc7bb] bg-[#f7f4ef] px-5 py-3 text-sm text-[#111111] transition hover:bg-[#ede8df]"
              >
                Use sample notes →
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste meeting notes here..."
              className="h-[420px] w-full resize-none border border-[#d8d2c8] bg-[#f7f4ef] p-5 text-sm leading-6 text-[#111111] outline-none transition placeholder:text-[#9a9288] focus:border-[#111111]"
            />

            <button
              onClick={runWorkflow}
              disabled={loading || !notes.trim()}
              className="mt-5 w-full bg-[#111111] px-5 py-4 font-medium text-white transition hover:bg-[#2b2b2b] disabled:cursor-not-allowed disabled:bg-[#b9b0a4]"
            >
              {loading ? "Running MCP Workflow..." : "Run AI Workflow →"}
            </button>

            {error && (
              <div className="mt-5 border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>

          <section className="border border-[#d8d2c8] bg-[#fbfaf7] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8a8177]">
              Pipeline
            </p>
            <h2 className="mt-2 font-serif text-3xl">Workflow Steps</h2>
            <p className="mt-1 text-sm text-[#6f6a63]">
              The visible automation path from input to final business output.
            </p>

            <div className="mt-6 space-y-4">
              <WorkflowStep
                number="01"
                title="Frontend receives notes"
                description="The user provides raw meeting notes through the interface."
                active={loading || Boolean(result)}
              />
              <WorkflowStep
                number="02"
                title="Next.js API route starts"
                description="The backend receives the notes and starts the workflow."
                active={loading || Boolean(result)}
              />
              <WorkflowStep
                number="03"
                title="MCP client connects"
                description="The app connects to the local MCP server through stdio."
                active={loading || Boolean(result)}
              />
              <WorkflowStep
                number="04"
                title="MCP tools execute"
                description="Tools summarize notes, extract actions, and draft the email."
                active={loading || Boolean(result)}
              />
              <WorkflowStep
                number="05"
                title="Human reviews output"
                description="The email is prepared as a draft instead of being sent automatically."
                active={Boolean(result)}
              />
            </div>
          </section>
        </div>

        {result && (
          <section className="mt-8 grid gap-8 lg:grid-cols-3">
            <OutputCard eyebrow="" title="Meeting Summary">
              <p className="text-sm leading-7 text-[#4d4944]">
                {result.summary}
              </p>
            </OutputCard>

            <OutputCard eyebrow="" title="Action Items">
              <ul className="space-y-3 text-sm leading-6 text-[#4d4944]">
                {result.actionItems.map((item, index) => (
                  <li
                    key={index}
                    className="border border-[#d8d2c8] bg-[#f7f4ef] p-3"
                  >
                    <span className="mr-2 font-medium text-[#111111]">
                      {index + 1}.
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </OutputCard>

            <OutputCard eyebrow="" title="Follow-up Email">
              <div className="space-y-4 text-sm leading-6 text-[#4d4944]">
                <div className="border border-[#d8d2c8] bg-[#f7f4ef] p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8a8177]">
                    Subject
                  </p>
                  <p className="mt-1 font-medium text-[#111111]">
                    {result.followUpEmail.subject}
                  </p>
                </div>

                <div className="whitespace-pre-wrap border border-[#d8d2c8] bg-[#f7f4ef] p-4">
                  {result.followUpEmail.body}
                </div>
              </div>
            </OutputCard>
          </section>
        )}

        <section className="mt-8 border border-[#d8d2c8] bg-[#fbfaf7] p-6">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8a8177]">
                MCP Architecture
              </p>
              <h2 className="mt-2 font-serif text-3xl">How this uses MCP</h2>
            </div>

            <p className="text-sm leading-7 text-[#4d4944]">
              This demo uses a custom local MCP server with three tools:
              <span className="font-medium text-[#111111]">
                {" "}
                summarize_notes
              </span>
              ,
              <span className="font-medium text-[#111111]">
                {" "}
                extract_action_items
              </span>
              , and
              <span className="font-medium text-[#111111]">
                {" "}
                draft_follow_up_email
              </span>
              . The Next.js backend acts as the MCP client, calls those tools
              through the Model Context Protocol, and returns the final workflow
              output to the frontend.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-[#d8d2c8] bg-[#fbfaf7] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#6f6a63]">
      {children}
    </span>
  );
}

function MiniPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-2 w-2 rounded-full bg-[#b98b45]" />
      <span>{text}</span>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  description,
  active
}: {
  number: string;
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={`border p-4 transition ${
        active
          ? "border-[#b98b45] bg-[#f4efe6]"
          : "border-[#d8d2c8] bg-[#f7f4ef]"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center border text-xs font-medium ${
            active
              ? "border-[#b98b45] bg-[#b98b45] text-white"
              : "border-[#d8d2c8] bg-[#fbfaf7] text-[#8a8177]"
          }`}
        >
          {number}
        </div>
        <div>
          <h3 className="font-medium text-[#111111]">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-[#6f6a63]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function OutputCard({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#d8d2c8] bg-[#fbfaf7] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8a8177]">
        {eyebrow}
      </p>
      <h2 className="mt-2 mb-5 font-serif text-3xl">{title}</h2>
      {children}
    </div>
  );
}