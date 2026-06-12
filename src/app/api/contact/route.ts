import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as Sentry from "@sentry/nextjs";
import { siteConfig } from "@/config/site";

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  type: "suggestion" | "complaint";
};

// Pragmatic email shape check — not RFC-perfect, just enough to reject typos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!EMAIL_RE.test(body.email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const label = body.type === "complaint" ? "Complaint" : "Suggestion";
  const subject = body.subject
    ? `[${label}] ${body.subject}`
    : `[${label}] from ${body.name}`;

  const { error } = await resend.emails.send({
    from: siteConfig.emailFrom,
    to: siteConfig.notifyEmails,
    replyTo: body.email,
    subject,
    text: `From: ${body.name} <${body.email}>\nType: ${label}\n\n${body.message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    Sentry.captureException(error, { tags: { route: "contact" } });
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
