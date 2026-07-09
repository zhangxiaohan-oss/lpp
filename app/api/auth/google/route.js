import { NextResponse } from "next/server";
import { callbackUrl, requireEnv } from "../_shared/utils";

export async function GET(request) {
  const missing = requireEnv("Google / Gmail 登录", ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]);
  if (missing) return missing;

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", callbackUrl(request, "google"));
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "select_account");
  return NextResponse.redirect(authUrl);
}
