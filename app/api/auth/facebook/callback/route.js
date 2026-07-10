import { callbackUrl, clearOAuthStateCookie, redirectWithCookies, requireEnv, sessionCookie, verifyOAuthState } from "../../_shared/utils";

export async function GET(request) {
  const clearState = clearOAuthStateCookie("facebook");
  const missing = requireEnv("Facebook 登录", ["META_APP_ID", "META_APP_SECRET"]);
  if (missing) return missing;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!verifyOAuthState(request, "facebook", state)) return redirectWithCookies(request, "/?auth=facebook-state-failed", [clearState]);
  if (!code) return redirectWithCookies(request, "/?auth=facebook-missing-code", [clearState]);

  const version = process.env.META_API_VERSION || "v23.0";
  const tokenUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", process.env.META_APP_ID);
  tokenUrl.searchParams.set("client_secret", process.env.META_APP_SECRET);
  tokenUrl.searchParams.set("redirect_uri", callbackUrl(request, "facebook"));
  tokenUrl.searchParams.set("code", code);

  const tokenResponse = await fetch(tokenUrl);
  if (!tokenResponse.ok) return redirectWithCookies(request, "/?auth=facebook-token-failed", [clearState]);
  const token = await tokenResponse.json();
  const profileUrl = new URL(`https://graph.facebook.com/${version}/me`);
  profileUrl.searchParams.set("fields", "id,name,email,picture");
  profileUrl.searchParams.set("access_token", token.access_token);
  const profileResponse = await fetch(profileUrl);

  if (!profileResponse.ok) return redirectWithCookies(request, "/?auth=facebook-profile-failed", [clearState]);
  const profile = await profileResponse.json();
  const session = {
    id: `FACEBOOK-${profile.id}`,
    provider: "facebook",
    boundProviders: ["facebook", "messenger"],
    name: profile.name || "Facebook User",
    email: profile.email || "",
    avatar: profile.picture?.data?.url || "",
    walletBalance: "0.00"
  };
  return redirectWithCookies(request, "/?auth=facebook-success", [clearState, sessionCookie(session)]);
}
