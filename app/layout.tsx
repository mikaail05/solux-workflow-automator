import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solux AI Workflow Automator",
  description: "Mini project demonstrating Claude API and MCP workflow automation"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}