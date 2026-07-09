import { NextResponse } from "next/server";
import { clearSessionCookie } from "../../auth/_shared/utils";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.headers.append("set-cookie", clearSessionCookie());
  return response;
}
