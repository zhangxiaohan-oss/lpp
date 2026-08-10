import { getStore } from "@netlify/blobs";

export const dynamic = "force-dynamic";

const STORE_NAME = "oufan-admin";
const PRODUCTS_KEY = "products";

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

async function readProducts() {
  const store = getStore(STORE_NAME);
  const saved = await store.get(PRODUCTS_KEY, { type: "json" });
  return Array.isArray(saved) ? saved : [];
}

export async function GET() {
  try {
    const products = await readProducts();
    return noStoreJson({ products });
  } catch (error) {
    return noStoreJson({ products: [], error: error.message || "Unable to load products" });
  }
}

export async function PUT(request) {
  if (!hasValidAdminToken(request)) {
    return noStoreJson({ ok: false, error: "Admin publish token is missing or invalid" }, 401);
  }

  try {
    const body = await request.json();
    const products = Array.isArray(body.products) ? body.products : [];
    const store = getStore(STORE_NAME);
    await store.setJSON(PRODUCTS_KEY, products);
    return noStoreJson({ ok: true, count: products.length });
  } catch (error) {
    return noStoreJson({ ok: false, error: error.message || "Unable to save products" }, 500);
  }
}
