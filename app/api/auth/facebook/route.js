import { NextResponse } from "next/server";
import { callbackUrl, createOAuthState, oauthStateCookie, requireEnv } from "../_shared/utils";

export async function GET(request) {
  const missing = requireEnv("Facebook 登录", ["META_APP_ID", "META_APP_SECRET"]);
  if (missing) return missing;

  const version = process.env.META_API_VERSION || "v23.0";
  const state = createOAuthState("facebook");
  const authUrl = new URL(`https://www.facebook.com/${version}/dialog/oauth`);
  authUrl.searchParams.set("client_id", process.env.META_APP_ID);
  authUrl.searchParams.set("redirect_uri", callbackUrl(request, "facebook"));
  authUrl.searchParams.set("scope", "email,public_profile");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authUrl);
  response.headers.append("set-cookie", oauthStateCookie("facebook", state));
  return response;
}
