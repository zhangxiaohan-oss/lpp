import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge || "", { status: 200 });
  }
  return NextResponse.json({ error: "WhatsApp webhook verification failed" }, { status: 403 });
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const messages = payload.entry?.flatMap((entry) => entry.changes || [])
    .flatMap((change) => change.value?.messages || []) || [];
  console.log("[oufan-whatsapp-webhook]", JSON.stringify({ count: messages.length, messages }));
  return NextResponse.json({ received: true, messageCount: messages.length });
}
