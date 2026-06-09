import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  type: "suggestion" | "complaint";
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // TODO: wire up Resend — deliver to contact@hilkaaps.com
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: ..., to: "contact@hilkaaps.com", ... });

  console.log("Contact form submission:", body);

  return NextResponse.json({ ok: true });
}
