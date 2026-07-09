import { NextResponse } from "next/server";
import { callbackUrl, requireEnv, sessionCookie } from "../../_shared/utils";

export async function GET(request) {
  const missing = requireEnv("Google / Gmail 登录", ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]);
  if (missing) return missing;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/?auth=google-missing-code", request.url));

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: callbackUrl(request, "google"),
      grant_type: "authorization_code"
    })
  });

  if (!tokenResponse.ok) return NextResponse.redirect(new URL("/?auth=google-token-failed", request.url));
  const token = await tokenResponse.json();
  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { authorization: `Bearer ${token.access_token}` }
  });

  if (!userResponse.ok) return NextResponse.redirect(new URL("/?auth=google-profile-failed", request.url));
  const profile = await userResponse.json();
  const session = {
    id: `GOOGLE-${profile.sub}`,
    provider: "gmail",
    boundProviders: ["gmail"],
    name: profile.name || "Google User",
    email: profile.email || "",
    avatar: profile.picture || "",
    walletBalance: "0.00"
  };
  const response = NextResponse.redirect(new URL("/?auth=google-success", request.url));
  response.headers.append("set-cookie", sessionCookie(session));
  return response;
}
