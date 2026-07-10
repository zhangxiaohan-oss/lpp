import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.MESSENGER_VERIFY_TOKEN) {
    return new NextResponse(challenge || "", { status: 200 });
  }
  return NextResponse.json({ error: "Messenger webhook verification failed" }, { status: 403 });
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const messaging = payload.entry?.flatMap((entry) => entry.messaging || []) || [];
  console.log("[oufan-messenger-webhook]", JSON.stringify({ count: messaging.length, messaging }));
  return NextResponse.json({ received: true, messageCount: messaging.length });
}
