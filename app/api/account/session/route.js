import { NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "../../auth/_shared/utils";

export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  const session = decodeSession(match?.[1]);
  return NextResponse.json({ authenticated: Boolean(session), session });
}
