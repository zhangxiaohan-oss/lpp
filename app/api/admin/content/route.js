import { getStore } from "@netlify/blobs";

export const dynamic = "force-dynamic";

const STORE_NAME = "oufan-admin";
const CONTENT_KEY = "page-content";

function noStoreJson(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function hasValidAdminToken(request) {
  if (process.env.NODE_ENV !== "production" && !process.env.ADMIN_API_TOKEN) return true;
  const expected = process.env.ADMIN_API_TOKEN;
  const provided = request.headers.get("x-admin-token");
  return Boolean(expected && provided && provided === expected);
}

function contentTimestamp(value) {
  return Number(value && typeof value === "object" ? value._updatedAt || 0 : 0);
}

async function readContent() {
  const store = getStore(STORE_NAME);
  const saved = await store.get(CONTENT_KEY, { type: "json" });
  return saved && typeof saved === "object" ? saved : {};
}

export async function GET() {
  try {
    const content = await readContent();
    return noStoreJson({ content });
  } catch (error) {
    return noStoreJson({ content: {}, error: error.message || "Unable to load page content" });
  }
}

export async function PUT(request) {
  if (!hasValidAdminToken(request)) {
    return noStoreJson({ ok: false, error: "Admin publish token is missing or invalid" }, 401);
  }

  try {
    const body = await request.json();
    const incoming = body.content && typeof body.content === "object" ? body.content : {};
    const store = getStore(STORE_NAME);
    const current = await readContent();
    const content = {
      ...incoming,
      _updatedAt: contentTimestamp(incoming) || Date.now()
    };
    if (contentTimestamp(current) > contentTimestamp(content)) {
      return noStoreJson({ ok: false, error: "A newer page version already exists", content: current }, 409);
    }
    await store.setJSON(CONTENT_KEY, content);
    return noStoreJson({ ok: true, content });
  } catch (error) {
    return noStoreJson({ ok: false, error: error.message || "Unable to save page content" }, 500);
  }
}
