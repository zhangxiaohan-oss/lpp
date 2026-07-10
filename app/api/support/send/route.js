import { NextResponse } from "next/server";

const metaVersion = () => process.env.META_API_VERSION || "v23.0";

function missing(names) {
  return names.filter((name) => !process.env[name]);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const channel = String(body.channel || "").toLowerCase();
  const message = String(body.message || "").trim();
  const recipient = String(body.recipient || body.to || "").trim();

  if (!message) return NextResponse.json({ ok: false, error: "MESSAGE_REQUIRED" }, { status: 400 });

  if (channel === "whatsapp") {
    const required = missing(["WHATSAPP_BUSINESS_PHONE_NUMBER_ID", "WHATSAPP_ACCESS_TOKEN"]);
    if (required.length) return NextResponse.json({ ok: false, error: "MISSING_CONFIG", missing: required }, { status: 400 });
    if (!recipient) return NextResponse.json({ ok: false, error: "WHATSAPP_RECIPIENT_REQUIRED", detail: "WhatsApp Cloud API requires a recipient phone number in E.164 format." }, { status: 400 });

    const apiUrl = `https://graph.facebook.com/${metaVersion()}/${process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: { preview_url: false, body: message }
      })
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json({ ok: response.ok, provider: "whatsapp", data }, { status: response.ok ? 200 : 502 });
  }

  if (channel === "messenger" || channel === "facebook") {
    const required = missing(["MESSENGER_PAGE_ACCESS_TOKEN"]);
    if (required.length) return NextResponse.json({ ok: false, error: "MISSING_CONFIG", missing: required }, { status: 400 });
    if (!recipient) return NextResponse.json({ ok: false, error: "MESSENGER_RECIPIENT_REQUIRED", detail: "Messenger Send API requires a recipient PSID from a Page conversation." }, { status: 400 });

    const apiUrl = `https://graph.facebook.com/${metaVersion()}/me/messages?access_token=${encodeURIComponent(process.env.MESSENGER_PAGE_ACCESS_TOKEN)}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ recipient: { id: recipient }, message: { text: message } })
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json({ ok: response.ok, provider: "messenger", data }, { status: response.ok ? 200 : 502 });
  }

  if (channel === "email") {
    return NextResponse.json({ ok: true, provider: "email", mailto: process.env.SUPPORT_EMAIL || "hello@lppbeach.com" });
  }

  return NextResponse.json({ ok: false, error: "UNSUPPORTED_CHANNEL" }, { status: 400 });
}
