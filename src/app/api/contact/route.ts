import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

const redis =
  process.env.UPSTASH_URL && process.env.UPSTASH_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_URL,
        token: process.env.UPSTASH_TOKEN,
      })
    : null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function sanitize(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (redis) {
    const key = `contact:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60 * 60);
    if (count > 3) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }
  }

  if (!resend) {
    return NextResponse.json(
      { error: "Email provider is not configured" },
      { status: 500 },
    );
  }

  const payload = {
    name: sanitize(parsed.data.name),
    email: sanitize(parsed.data.email),
    message: sanitize(parsed.data.message),
  };

  await resend.emails.send({
    from: "bgirgin.dev <onboarding@resend.dev>",
    to: "hello@bgirgin.dev",
    replyTo: payload.email,
    subject: `New contact from ${payload.name}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
  });

  return NextResponse.json({ ok: true });
}
