import { NextResponse } from "next/server";

export const SESSION_COOKIE = "oufan_session";

export function getOrigin(request) {
  return new URL(request.url).origin;
}

export function callbackUrl(request, provider) {
  return new URL(`/api/auth/${provider}/callback/`, getOrigin(request)).toString();
}

export function missingConfig(provider, variables) {
  const items = variables.map((name) => `<li><code>${name}</code></li>`).join("");
  return new NextResponse(`<!doctype html><html><head><meta charset="utf-8"><title>${provider} setup needed</title><style>body{font-family:Arial,sans-serif;max-width:720px;margin:60px auto;padding:0 20px;line-height:1.7}code{background:#f2f4ef;padding:2px 6px;border-radius:4px}a{color:#2d7d21}</style></head><body><h1>${provider} 还没有配置完成</h1><p>请在 <code>.env.local</code> 或部署平台环境变量里补充：</p><ul>${items}</ul><p>补齐后重新启动本地服务，再点击登录按钮。</p><p><a href="/">返回首页</a></p></body></html>`, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

export function requireEnv(provider, names) {
  const missing = names.filter((name) => !process.env[name]);
  return missing.length ? missingConfig(provider, missing) : null;
}

export function encodeSession(session) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(value) {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function sessionCookie(session) {
  return `${SESSION_COOKIE}=${encodeSession(session)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 14}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function htmlResponse(title, body) {
  return new NextResponse(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;max-width:720px;margin:60px auto;padding:0 20px;line-height:1.7}code{background:#f2f4ef;padding:2px 6px;border-radius:4px}a{color:#2d7d21}</style></head><body>${body}</body></html>`, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
