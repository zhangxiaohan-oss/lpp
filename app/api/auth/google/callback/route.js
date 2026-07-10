import { callbackUrl, clearOAuthStateCookie, redirectWithCookies, requireEnv, sessionCookie, verifyOAuthState } from "../../_shared/utils";

export async function GET(request) {
  const clearState = clearOAuthStateCookie("google");
  const missing = requireEnv("Google / Gmail 登录", ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]);
  if (missing) return missing;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!verifyOAuthState(request, "google", state)) return redirectWithCookies(request, "/?auth=google-state-failed", [clearState]);
  if (!code) return redirectWithCookies(request, "/?auth=google-missing-code", [clearState]);

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

  if (!tokenResponse.ok) return redirectWithCookies(request, "/?auth=google-token-failed", [clearState]);
  const token = await tokenResponse.json();
  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { authorization: `Bearer ${token.access_token}` }
  });

  if (!userResponse.ok) return redirectWithCookies(request, "/?auth=google-profile-failed", [clearState]);
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
  return redirectWithCookies(request, "/?auth=google-success", [clearState, sessionCookie(session)]);
}
