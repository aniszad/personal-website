import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE, SOCIALS } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 15;

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 2000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
      { status: 503 },
    );
  }

  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ error: "Please provide your name (max 100 chars)." }, { status: 400 });
  }
  if (!email || !isValidEmail(email) || email.length > MAX_EMAIL) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Please include a message (max 2000 chars)." }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: `Portfolio Contact <${process.env.RESEND_FROM_EMAIL}>`,
      to: SOCIALS.email,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: [
        `From: ${name} <${email}>`,
        "",
        message,
        "",
        `— Sent via ${SITE.url}`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form email failed", {
      detail: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Could not send the message. Please email directly." },
      { status: 502 },
    );
  }
}
