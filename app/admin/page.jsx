"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, faqs, heroSlides, products, reviews, servicePromises } from "../data";

const PRODUCT_KEY = "lpp_admin_products";
const PRODUCT_SYNC_TOKEN_KEY = "lpp_admin_publish_token";
const PAGE_CONTENT_KEY = "lpp_page_content";
const PAGE_CONTENT_EVENT = "lpp-page-content-change";
const PRODUCT_ORDER_KEY = "lpp_product_order";
const ORDER_KEY = "lpp_admin_orders";
const USER_KEY = "lpp_admin_users";
const SETTINGS_KEY = "lpp_admin_settings";
const USER_PASSWORD_RESET_KEY = "lpp_admin_superadmin_password_reset_version";
const USER_PASSWORD_RESET_VERSION = "2026-08-06-superadmin-default-password";

const permissionCatalog = [
  ["products", "商品编辑", "新增商品、编辑基础资料和库存"],
  ["publish", "发布上下架", "发布商品、上下架商品"],
  ["remove", "删除商品", "删除商品资料"],
  ["orders", "订单处理", "接单、发货、完成、取消和退款"],
  ["users", "账号权限", "新增管理员、分配权限"],
  ["settings", "系统设置", "编辑店铺与订单配置"]
];

const rolePresets = {
  super: {
    label: "超级管理员",
    permissions: { products: true, publish: true, remove: true, orders: true, users: true, settings: true }
  },
  manager: {
    label: "普通管理员",
    permissions: { products: true, publish: false, remove: false, orders: true, users: false, settings: false }
  }
};

const defaultSettings = {
  storeName: "Oufan",
  orderPrefix: "OUFAN",
  defaultCurrency: "USD",
  stockWarning: 20
};

function getDefaultPageContent() {
  return {
    heroSlides: heroSlides.map((slide) => ({ secondaryCta: "查看定制款", secondaryHref: "/shop?filter=custom", ...slide })),
    servicePromises: servicePromises.map((item) => ({ ...item })),
    categories: categories.map((item) => ({ ...item })),
    reviews: reviews.map((item) => ({ ...item })),
    faqs: faqs.map((item) => ({ ...item })),
    shopHero: {
      eyebrow: "全部商品",
      title: "草帽商店",
      description: "浏览所有草帽、救生员帽、海滩帽和批发定制款式。可搜索关键词、按场景筛选并查看人民币价格。"
    },
    categoryIntro: {
      eyebrow: "按场景选购",
      title: "热门分类"
    },
    featured: {
      eyebrow: "精选商品",
      title: "热卖草帽",
      description: "从海滩到户外工作，挑一顶能遮阳、能出片、也能定制 Logo 的草帽。",
      button: "查看全部商品",
      href: "/shop"
    },
    newsletter: {
      eyebrow: "展示与询价",
      title: "准备好把草帽加入你的夏季货架了吗？",
      description: "留下邮箱或直接前往定制页，告诉我们数量、Logo 方式和使用场景。",
      button: "订阅更新",
      contact: "联系我们",
      href: "/contact"
    },
    footer: {
      brandTitle: "草帽品牌展示站",
      description: "面向海滩、冲浪、园艺、户外团队和品牌活动的草帽展示站，支持批发与 Logo 定制咨询。",
      logos: ["COAST CLUB", "SURF LAB", "PALM DAY", "RGH", "KONA", "OUTDOOR CREW"]
    }
  };
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function mergeList(savedList, defaultList) {
  if (!Array.isArray(savedList) || !savedList.length) return defaultList;
  return savedList
    .map((item, index) => ({ ...(defaultList[index] || {}), ...asObject(item) }))
    .filter((item) => Object.keys(item).length);
}

function mergePageContent(saved = {}) {
  const source = asObject(saved);
  const defaults = getDefaultPageContent();
  return {
    ...defaults,
    ...source,
    heroSlides: mergeList(source.heroSlides, defaults.heroSlides),
    servicePromises: mergeList(source.servicePromises, defaults.servicePromises),
    categories: mergeList(source.categories, defaults.categories),
    reviews: mergeList(source.reviews, defaults.reviews),
    faqs: mergeList(source.faqs, defaults.faqs),
    shopHero: { ...defaults.shopHero, ...asObject(source.shopHero) },
    categoryIntro: { ...defaults.categoryIntro, ...asObject(source.categoryIntro) },
    featured: { ...defaults.featured, ...asObject(source.featured) },
    newsletter: { ...defaults.newsletter, ...asObject(source.newsletter) },
    footer: { ...defaults.footer, ...asObject(source.footer) }
  };
}

function contentTimestamp(value) {
  return Number(asObject(value)._updatedAt || 0);
}

function shouldUseRemoteContent(localRaw, remoteRaw) {
  const hasLocal = Boolean(localRaw && typeof localRaw === "object" && Object.keys(localRaw).length);
  if (!remoteRaw || typeof remoteRaw !== "object" || !Object.keys(remoteRaw).length) return false;
  if (!hasLocal) return true;
  const localTime = contentTimestamp(localRaw);
  const remoteTime = contentTimestamp(remoteRaw);
  return remoteTime > localTime;
}

function syncDocumentTitle(storeName) {
  if (typeof document === "undefined") return;
  document.title = String(storeName || "").trim() || "草帽品牌展示站";
}

const blankProduct = {
  title: "",
  slug: "",
  price: "",
  stock: 100,
  category: "草帽",
  image: "/assets/product-01.jpg",
  gallery: ["/assets/product-01.jpg"],
  productLink: "",
  tags: "custom, wholesale",
  status: "draft",
  description: "",
  sku: "",
  cost: "",
  weight: "",
  seoTitle: "",
  seoDescription: ""
};

const blankUser = {
  name: "",
  username: "",
  password: "lpp-demo",
  role: "manager",
  active: true,
  mustChangePassword: true,
  permissions: rolePresets.manager.permissions
};

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value, eventName) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Large uploaded images can exceed browser storage. Cloud sync still keeps the data.
  }
  if (eventName) window.dispatchEvent(new Event(eventName));
}
async function fetchRemoteProducts() {
  const response = await fetch("/api/admin/products", { cache: "no-store" });
  if (!response.ok) throw new Error("云端商品读取失败");
  const data = await response.json();
  return Array.isArray(data.products) ? data.products : [];
}

async function fetchRemoteContent() {
  const response = await fetch("/api/admin/content", { cache: "no-store" });
  if (!response.ok) throw new Error("页面装修读取失败");
  const data = await response.json();
  return data.content && typeof data.content === "object" ? data.content : {};
}

async function pushRemoteContent(content) {
  let token = window.localStorage.getItem(PRODUCT_SYNC_TOKEN_KEY) || "";
  let response = await fetch("/api/admin/content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token
    },
    body: JSON.stringify({ content })
  });

  if (response.status === 401) {
    token = window.prompt("\u8bf7\u8f93\u5165\u540e\u53f0\u53d1\u5e03\u5bc6\u94a5\u3002\u8fd9\u4e2a\u5bc6\u94a5\u9700\u8981\u548c Netlify \u73af\u5883\u53d8\u91cf ADMIN_API_TOKEN \u4e00\u81f4\uff0c\u7528\u4e8e\u4fdd\u62a4\u7ebf\u4e0a\u9875\u9762\u88c5\u4fee\u3002") || "";
    if (!token) throw new Error("\u7f3a\u5c11\u540e\u53f0\u53d1\u5e03\u5bc6\u94a5\uff0c\u9875\u9762\u88c5\u4fee\u53ea\u4fdd\u5b58\u5230\u672c\u673a\u6d4f\u89c8\u5668");
    window.localStorage.setItem(PRODUCT_SYNC_TOKEN_KEY, token);
    response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token
      },
      body: JSON.stringify({ content })
    });
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.error || "云端页面装修保存失败");
  return data;
}


async function pushRemoteProducts(products) {
  let token = window.localStorage.getItem(PRODUCT_SYNC_TOKEN_KEY) || "";
  let response = await fetch("/api/admin/products", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token
    },
    body: JSON.stringify({ products })
  });

  if (response.status === 401) {
    token = window.prompt("请输入后台发布密钥。这个密钥需要和 Netlify 环境变量 ADMIN_API_TOKEN 一致，用于保护线上商品库。") || "";
    if (!token) throw new Error("缺少后台发布密钥，商品只保存到本机浏览器");
    window.localStorage.setItem(PRODUCT_SYNC_TOKEN_KEY, token);
    response = await fetch("/api/admin/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token
      },
      body: JSON.stringify({ products })
    });
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.error || "云端商品保存失败");
  return data;
}

function readImageFiles(files) {
  const imageFiles = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
  return Promise.all(imageFiles.map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ src: reader.result, name: file.name });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
}

function mergePermissions(user) {
  return {
    ...rolePresets[user.role || "manager"].permissions,
    ...(user.permissions || {})
  };
}


function normalizeUser(user, index = 0) {
  const role = rolePresets[user?.role] ? user.role : "manager";
  const username = String(user?.username || `manager${index + 1}`).trim();
  return {
    id: user?.id || `user-${Date.now()}-${index}`,
    name: user?.name || username,
    username,
    password: user?.password || "lpp-demo",
    role,
    active: user?.active !== false,
    mustChangePassword: user?.mustChangePassword ?? true,
    permissions: {
      ...rolePresets[role].permissions,
      ...(user?.permissions || {})
    }
  };
}

function roleLabel(role) {
  return rolePresets[role]?.label || rolePresets.manager.label;
}
function seedUsers() {
  return [
    {
      id: "user-superadmin",
      name: "超级管理员",
      username: "superadmin",
      password: "lpp-demo",
      role: "super",
      active: true,
      mustChangePassword: true,
      permissions: rolePresets.super.permissions
    },
    {
      id: "user-manager",
      name: "普通管理员",
      username: "manager",
      password: "lpp-demo",
      role: "manager",
      active: true,
      mustChangePassword: true,
      permissions: rolePresets.manager.permissions
    }
  ];
}

function parseSkuList(value) {
  const raw = Array.isArray(value) ? value.join(",") : String(value || "");
  return Array.from(new Set(raw.split(/[\n,，;；]+/).map((item) => item.trim()).filter(Boolean)));
}

function displaySku(product) {
  const list = Array.isArray(product.skus) && product.skus.length ? product.skus : parseSkuList(product.sku);
  return list.length ? list.join(" / ") : "未填写 SKU";
}

function normalizeProduct(product, index) {
  const title = product.title || `商品 ${index + 1}`;
  const slug = product.slug || title.toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "") || `admin-product-${Date.now()}`;
  const tags = Array.isArray(product.tags) ? product.tags : String(product.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
  const image = product.image || (Array.isArray(product.gallery) && product.gallery[0]) || "/assets/product-01.jpg";
  const productLink = product.productLink || product.link || product.url || product.href || product.sourceUrl || product.detailUrl || product.purchaseUrl || "";
  const description = product.description || product.summary || product.shortDescription || product.intro || "";
  return {
    ...product,
    id: product.id || `admin-${Date.now()}-${index}`,
    title,
    slug,
    sku: product.sku || `LPP-${String(index + 1).padStart(4, "0")}`,
    price: product.price === "" || product.price === null || product.price === undefined ? null : Number(product.price),
    stock: Number(product.stock ?? 0),
    image,
    productLink,
    link: productLink,
    url: productLink,
    description,
    gallery: Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [image],
    tags,
    status: product.status || "active",
    category: product.category || (tags.includes("lifeguard") ? "救生员帽" : tags.includes("surf") ? "冲浪系列" : "草帽"),
    rating: product.rating || 5,
    reviewCount: product.reviewCount || 0,
    adminManaged: product.adminManaged ?? true
  };
}


function productTimestamp(value) {
  return Number(asObject(value)._updatedAt || 0);
}

function mergeProducts(remoteProducts, localProducts) {
  const merged = new Map();
  [...localProducts, ...remoteProducts].forEach((product, index) => {
    const key = product.slug || product.id || `product-${index}`;
    const previous = merged.get(key);
    if (!previous || productTimestamp(product) >= productTimestamp(previous)) {
      merged.set(key, { ...(previous || {}), ...product });
    }
  });
  return Array.from(merged.values()).map((product, index) => normalizeProduct(product, index));
}

function productsChanged(previousProducts, nextProducts) {
  return JSON.stringify(previousProducts) !== JSON.stringify(nextProducts);
}

function seedProducts() {
  return products.map((product, index) => normalizeProduct({
    ...product,
    stock: 80 + index * 7,
    status: "active",
    sku: `LPP-${String(index + 1).padStart(4, "0")}`,
    category: product.tags?.includes("lifeguard") ? "救生员帽" : product.tags?.includes("surf") ? "冲浪系列" : "草帽",
    cost: product.price ? Math.round(product.price * 46) / 100 : "",
    seoTitle: product.title,
    seoDescription: product.description
  }, index));
}

function seedOrders() {
  const first = products[1] || products[0];
  const second = products[4] || products[0];
  return [
    makeOrder("LPP20260629-10001", first, 24, "pending", "海边活动采购", "需要确认 Logo 贴章和批量包装。"),
    makeOrder("LPP20260628-10008", second, 8, "accepted", "度假村礼品店", "先发样品，确认后追加 200 件。")
  ];
}

function makeOrder(id, product, quantity, status, customerName, notes) {
  return {
    id,
    createdAt: new Date().toISOString(),
    source: status === "pending" ? "购物网页" : "后台录入",
    status,
    paymentStatus: status === "accepted" ? "paid" : "pending",
    fulfillmentStatus: status === "accepted" ? "processing" : "unfulfilled",
    productSlug: product.slug,
    productTitle: product.title,
    productImage: product.image,
    quantity,
    unitPrice: product.price,
    total: product.price ? product.price * quantity : null,
    customer: { name: customerName, email: "buyer@example.com", phone: "13800000000", address: "示例收货地址" },
    notes,
    timeline: [{ label: "客户提交订单", time: new Date().toISOString() }]
  };
}

function money(value) {
  return value === null || value === undefined || value === "" ? "定制报价" : `$${Number(value).toFixed(2)}`;
}

function time(value) {
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "superadmin", password: "lpp-demo" });
  const [loginError, setLoginError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("overview");
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(blankProduct);
  const [editingId, setEditingId] = useState("");
  const [query, setQuery] = useState("");
  const [userForm, setUserForm] = useState(blankUser);
  const [editingUserId, setEditingUserId] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [pageContent, setPageContent] = useState(getDefaultPageContent);
  const [contentSaved, setContentSaved] = useState(false);
  const [contentStatus, setContentStatus] = useState("正在读取云端页面装修...");
  const [cloudStatus, setCloudStatus] = useState("正在读取云端商品...");

  const power = currentUser ? mergePermissions(currentUser) : rolePresets.super.permissions;
  const currentRoleLabel = currentUser ? roleLabel(currentUser.role) : "未登录";
  const tabTitles = {
    overview: "后台总览",
    products: "商品管理",
    content: "页面装修",
    orders: "订单管理",
    users: "权限管理",
    settings: "系统设置"
  };
  const tabTitle = tabTitles[tab] || "后台管理";

  useEffect(() => {
    const savedUsers = readJson(USER_KEY, []);
    const shouldResetSuperadminPassword = window.localStorage.getItem(USER_PASSWORD_RESET_KEY) !== USER_PASSWORD_RESET_VERSION;
    const initialUsers = savedUsers.length ? savedUsers.map((user) => (
      shouldResetSuperadminPassword && user.username === "superadmin"
        ? { ...user, password: "lpp-demo", mustChangePassword: true }
        : user
    )) : seedUsers();
    setUsers(initialUsers);
    if (!savedUsers.length || shouldResetSuperadminPassword) {
      writeJson(USER_KEY, initialUsers, "lpp-admin-users-change");
      window.localStorage.setItem(USER_PASSWORD_RESET_KEY, USER_PASSWORD_RESET_VERSION);
    }

    const savedSettings = readJson(SETTINGS_KEY, defaultSettings);
    const initialSettings = { ...defaultSettings, ...savedSettings };
    setSettings(initialSettings);
    syncDocumentTitle(initialSettings.storeName);

    const rawSavedContent = readJson(PAGE_CONTENT_KEY, {});
    const savedContent = mergePageContent(rawSavedContent);
    setPageContent(savedContent);
    fetchRemoteContent()
      .then((remoteContent) => {
        if (!Object.keys(remoteContent).length) {
          setContentStatus("云端暂无页面装修，当前显示本机草稿");
          return;
        }
        if (!shouldUseRemoteContent(rawSavedContent, remoteContent)) {
          setContentStatus("本机装修草稿较新，点击保存后会发布到云端");
          return;
        }
        const mergedContent = mergePageContent(remoteContent);
        setPageContent(mergedContent);
        writeJson(PAGE_CONTENT_KEY, mergedContent, PAGE_CONTENT_EVENT);
        setContentStatus("已同步云端页面装修");
      })
      .catch((error) => setContentStatus(error.message || "云端页面装修读取失败，本机缓存仍可用"));

    const savedProducts = readJson(PRODUCT_KEY, []);
    const initialProducts = savedProducts.length ? savedProducts.map((product, index) => normalizeProduct(product, index)) : seedProducts();
    setItems(initialProducts);
    if (!savedProducts.length) writeJson(PRODUCT_KEY, initialProducts, "lpp-admin-products-change");

    let ignoreRemoteProducts = false;
    fetchRemoteProducts()
      .then((remoteProducts) => {
        if (ignoreRemoteProducts) return;
        const normalizedRemote = remoteProducts.map((product, index) => normalizeProduct(product, index));
        const mergedProducts = mergeProducts(normalizedRemote, initialProducts);

        if (mergedProducts.length) {
          setItems(mergedProducts);
          writeJson(PRODUCT_KEY, mergedProducts, "lpp-admin-products-change");
          const shouldUploadMerged = savedProducts.length && productsChanged(normalizedRemote, mergedProducts);
          setCloudStatus(shouldUploadMerged ? "已恢复本机商品链接，正在同步到云端..." : `已同步云端商品：${mergedProducts.length} 个`);
          if (shouldUploadMerged) {
            pushRemoteProducts(mergedProducts)
              .then(() => setCloudStatus(`已恢复并同步商品：${mergedProducts.length} 个`))
              .catch((error) => setCloudStatus(error.message));
          }
          return;
        }

        setCloudStatus("云端暂无后台商品，新增或保存后会同步");
      })
      .catch((error) => setCloudStatus(error.message || "云端商品读取失败，本机缓存仍可用"));

    const syncOrders = () => {
      const savedOrders = readJson(ORDER_KEY, []);
      const initialOrders = savedOrders.length ? savedOrders : seedOrders();
      setOrders(initialOrders);
      if (!savedOrders.length) writeJson(ORDER_KEY, initialOrders, "lpp-admin-orders-change");
    };

    syncOrders();
    window.addEventListener("lpp-admin-orders-change", syncOrders);
    window.addEventListener("storage", syncOrders);
    return () => {
      window.removeEventListener("lpp-admin-orders-change", syncOrders);
      window.removeEventListener("storage", syncOrders);
      ignoreRemoteProducts = true;
    };
  }, []);

  const stats = useMemo(() => ({
    active: items.filter((item) => item.status === "active").length,
    pending: orders.filter((order) => order.status === "pending").length,
    revenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    low: items.filter((item) => Number(item.stock) <= 20).length
  }), [items, orders]);

  const editableContent = mergePageContent(pageContent);

  const visibleProducts = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return items;
    return items.filter((item) => [item.title, displaySku(item), item.category, item.status, item.description, item.productLink, item.tags?.join(" ")].join(" ").toLowerCase().includes(text));
  }, [items, query]);

  function saveProducts(nextItems) {
    const stamp = Date.now();
    const stampedItems = nextItems.map((item) => ({ ...item, _updatedAt: item._updatedAt || stamp }));
    setItems(stampedItems);
    writeJson(PRODUCT_KEY, stampedItems, "lpp-admin-products-change");
    writeJson(PRODUCT_ORDER_KEY, stampedItems.map((item) => item.slug || item.id).filter(Boolean), "lpp-admin-products-change");
    setCloudStatus("正在同步商品到云端...");
    pushRemoteProducts(stampedItems)
      .then((result) => {
        const confirmed = Array.isArray(result.products) ? mergeProducts(result.products, stampedItems) : stampedItems;
        setItems(confirmed);
        writeJson(PRODUCT_KEY, confirmed, "lpp-admin-products-change");
        setCloudStatus(`已同步云端商品：${confirmed.length} 个`);
      })
      .catch((error) => setCloudStatus(error.message));
  }

  function updatePageSection(section, field, value) {
    setContentSaved(false);
    setPageContent((current) => ({
      ...current,
      [section]: { ...(current[section] || {}), [field]: value }
    }));
  }

  function updatePageList(section, index, field, value) {
    setContentSaved(false);
    setPageContent((current) => ({
      ...current,
      [section]: (current[section] || []).map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item)
    }));
  }

  function addPageListItem(section, item) {
    setContentSaved(false);
    setPageContent((current) => ({ ...current, [section]: [...(current[section] || []), item] }));
  }

  function removePageListItem(section, index) {
    setContentSaved(false);
    setPageContent((current) => ({ ...current, [section]: (current[section] || []).filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function chooseContentImage(section, index, event) {
    const picked = await readImageFiles(event.target.files);
    if (picked[0]) updatePageList(section, index, "image", picked[0].src);
    event.target.value = "";
  }

  function savePageContent(event) {
    event.preventDefault();
    if (!power.settings) return;
    const normalized = mergePageContent({ ...pageContent, _updatedAt: Date.now() });
    setPageContent(normalized);
    writeJson(PAGE_CONTENT_KEY, normalized, PAGE_CONTENT_EVENT);
    setContentSaved(false);
    setContentStatus("正在同步页面装修到云端...");
    pushRemoteContent(normalized)
      .then((result) => {
        const confirmed = mergePageContent(result.content || normalized);
        if (contentTimestamp(confirmed) < contentTimestamp(normalized)) {
          setContentSaved(false);
          setContentStatus("云端已有更新版本，请刷新后台后再保存");
          return;
        }
        setPageContent(confirmed);
        writeJson(PAGE_CONTENT_KEY, confirmed, PAGE_CONTENT_EVENT);
        setContentSaved(true);
        setContentStatus("已保存并确认云端页面装修");
        window.setTimeout(() => setContentSaved(false), 2200);
      })
      .catch((error) => {
        setContentSaved(false);
        setContentStatus(error.message);
      });
  }

  function resetPageContent() {
    if (!power.settings) return;
    const defaults = getDefaultPageContent();
    setPageContent(defaults);
    setContentSaved(false);
    setContentStatus("已恢复默认页面装修草稿，点击保存后才会发布");
  }

  function moveProduct(productId, direction) {
    const currentIndex = items.findIndex((item) => item.id === productId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) return;
    const nextItems = items.slice();
    [nextItems[currentIndex], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[currentIndex]];
    saveProducts(nextItems);
  }

  function saveOrders(nextOrders) {
    setOrders(nextOrders);
    writeJson(ORDER_KEY, nextOrders, "lpp-admin-orders-change");
  }

  function saveUsers(nextUsers) {
    setUsers(nextUsers);
    writeJson(USER_KEY, nextUsers, "lpp-admin-users-change");
    if (currentUser) {
      const refreshed = nextUsers.find((user) => user.id === currentUser.id);
      if (refreshed) setCurrentUser(refreshed);
    }
  }

  function updateSettings(field, value) {
    setSettingsSaved(false);
    if (field === "storeName") syncDocumentTitle(value);
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function saveSettings(event) {
    event.preventDefault();
    if (!power.settings) return;
    const nextSettings = {
      ...settings,
      storeName: String(settings.storeName || "Oufan").trim() || "Oufan",
      orderPrefix: String(settings.orderPrefix || "OUFAN").trim() || "OUFAN",
      defaultCurrency: settings.defaultCurrency === "CNY" ? "CNY" : "USD",
      stockWarning: Math.max(0, Number(settings.stockWarning || 0))
    };
    setSettings(nextSettings);
    writeJson(SETTINGS_KEY, nextSettings, "lpp-admin-settings-change");
    syncDocumentTitle(nextSettings.storeName);
    setSettingsSaved(true);
    window.setTimeout(() => setSettingsSaved(false), 2200);
  }

  function login(event) {
    event.preventDefault();
    const user = users.find((item) => item.username === loginForm.username.trim() && item.password === loginForm.password);
    if (!user) {
      setLoginError("账号或密码不正确");
      return;
    }
    if (!user.active) {
      setLoginError("该账号已停用，请联系超级管理员");
      return;
    }
    setLoginError("");
    setCurrentUser(user);
    setPasswordForm({ next: "", confirm: "" });
    if (!user.mustChangePassword) setAuthed(true);
  }

  function completeFirstPassword(event) {
    event.preventDefault();
    if (passwordForm.next.length < 6) {
      setPasswordError("新密码至少 6 位");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("两次输入的新密码不一致");
      return;
    }
    const nextUsers = users.map((user) => user.id === currentUser.id ? { ...user, password: passwordForm.next, mustChangePassword: false } : user);
    saveUsers(nextUsers);
    setCurrentUser(nextUsers.find((user) => user.id === currentUser.id));
    setPasswordError("");
    setAuthed(true);
  }

  function logout() {
    setAuthed(false);
    setCurrentUser(null);
    setLoginForm({ username: "superadmin", password: "lpp-demo" });
    setTab("overview");
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateProductImageUrl(value) {
    setForm((current) => ({
      ...current,
      image: value,
      gallery: value ? [value] : []
    }));
  }

  async function chooseProductImages(event) {
    const picked = await readImageFiles(event.target.files);
    if (!picked.length) return;
    const gallery = picked.map((file) => file.src);
    setForm((current) => ({
      ...current,
      image: gallery[0],
      gallery,
      imageNames: picked.map((file) => file.name)
    }));
    event.target.value = "";
  }

  function removeProductImage(index) {
    setForm((current) => {
      const gallery = (current.gallery || [current.image]).filter(Boolean).filter((_, currentIndex) => currentIndex !== index);
      const imageNames = (current.imageNames || []).filter((_, currentIndex) => currentIndex !== index);
      const image = gallery[0] || "/assets/product-01.jpg";
      return { ...current, image, gallery: gallery.length ? gallery : [image], imageNames };
    });
  }

  function resetForm() {
    setEditingId("");
    setForm(blankProduct);
  }

  function submitProduct(event) {
    event.preventDefault();
    if (!power.products) return;
    const normalized = normalizeProduct(form, items.length);
    if (normalized.status === "active" && !power.publish) normalized.status = "draft";
    const nextItems = editingId ? items.map((item) => item.id === editingId ? { ...item, ...normalized, id: editingId } : item) : [{ ...normalized, id: `admin-${Date.now()}` }, ...items];
    saveProducts(nextItems);
    resetForm();
    setTab("products");
  }

  function editProduct(product) {
    if (!power.products) return;
    setEditingId(product.id);
    setForm({
      ...product,
      gallery: Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [product.image],
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || ""
    });
    setTab("products");
  }

  function setProductStatus(product, status) {
    if (status === "active" && !power.publish) return;
    saveProducts(items.map((item) => item.id === product.id ? { ...item, status } : item));
  }

  function deleteProduct(id) {
    if (!power.remove) return;
    saveProducts(items.filter((item) => item.id !== id));
  }

  function updateOrder(id, patch, label) {
    if (!power.orders) return;
    saveOrders(orders.map((order) => order.id === id ? { ...order, ...patch, timeline: [...(order.timeline || []), { label, time: new Date().toISOString() }] } : order));
  }

  function updateUserForm(field, value) {
    setUserForm((current) => ({ ...current, [field]: value }));
  }

  function setUserRole(role) {
    setUserForm((current) => ({ ...current, role, permissions: rolePresets[role].permissions }));
  }

  function togglePermission(key) {
    setUserForm((current) => ({
      ...current,
      permissions: { ...current.permissions, [key]: !current.permissions?.[key] }
    }));
  }

  function resetUserForm() {
    setEditingUserId("");
    setUserForm(blankUser);
    setShowUserForm(false);
  }

  function submitUser(event) {
    event.preventDefault();
    if (!power.users) return;
    const normalized = {
      ...userForm,
      id: editingUserId || `user-${Date.now()}`,
      username: userForm.username.trim(),
      name: userForm.name.trim() || userForm.username.trim(),
      permissions: mergePermissions(userForm)
    };
    const nextUsers = editingUserId ? users.map((user) => user.id === editingUserId ? { ...user, ...normalized } : user) : [normalized, ...users];
    saveUsers(nextUsers);
    resetUserForm();
  }

  function openNewUserForm() {
    setEditingUserId("");
    setUserForm(blankUser);
    setShowUserForm(true);
  }
  function editUser(user) {
    if (!power.users) return;
    setEditingUserId(user.id);
    setUserForm({ ...user, permissions: mergePermissions(user) });
    setShowUserForm(true);
  }

  function toggleUserActive(userId) {
    if (!power.users || userId === currentUser.id) return;
    saveUsers(users.map((user) => user.id === userId ? { ...user, active: !user.active } : user));
  }

  function requirePasswordReset(userId) {
    if (!power.users) return;
    saveUsers(users.map((user) => user.id === userId ? { ...user, mustChangePassword: true } : user));
  }

  if (!authed && !currentUser?.mustChangePassword) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={login}>
          <p className="admin-kicker">LPP Admin</p>
          <h1>后台管理登录</h1>
          <p>演示账号：superadmin / lpp-demo，manager / lpp-demo。首次登录会强制修改密码。</p>
          {loginError ? <div className="admin-error">{loginError}</div> : null}
          <label>账号<input value={loginForm.username} onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))} /></label>
          <label>密码<input type="password" value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} /></label>
          <button type="submit">进入后台</button>
        </form>
      </main>
    );
  }

  if (!authed && currentUser?.mustChangePassword) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={completeFirstPassword}>
          <p className="admin-kicker">First Login</p>
          <h1>首次登录修改密码</h1>
          <p>{currentUser.name}，为了账号安全，请先设置新密码。修改完成后才会进入后台。</p>
          {passwordError ? <div className="admin-error">{passwordError}</div> : null}
          <label>新密码<input type="password" value={passwordForm.next} onChange={(event) => setPasswordForm((current) => ({ ...current, next: event.target.value }))} /></label>
          <label>确认新密码<input type="password" value={passwordForm.confirm} onChange={(event) => setPasswordForm((current) => ({ ...current, confirm: event.target.value }))} /></label>
          <button type="submit">保存并进入后台</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/"><span>LPP</span><strong>商户管理</strong></a>
        <nav className="admin-nav" aria-label="后台导航">
          {[["overview", "总览", true], ["products", "商品上架", power.products], ["content", "页面装修", power.settings], ["orders", "订单管理", power.orders], ["users", "权限", power.users], ["settings", "设置", power.settings]].map(([key, label, enabled]) => (
            <button type="button" className={tab === key ? "is-active" : ""} key={key} disabled={!enabled} onClick={() => enabled && setTab(key)}>{label}</button>
          ))}
        </nav>
        <div className="admin-role-box"><span>当前账号</span><strong>{currentUser.name}</strong><small>{currentRoleLabel} · {currentUser.username}</small></div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div><p className="admin-kicker">Dashboard</p><h1>{tabTitle}</h1></div>
          <div className="admin-top-actions"><a href="/shop">查看购物网页</a><button type="button" onClick={logout}>退出</button></div>
        </header>

        {tab === "overview" ? <>
          <section className="admin-metrics">
            <article><span>在售商品</span><strong>{stats.active}</strong><small>同步到购物网页商品列表</small></article>
            <article><span>待处理订单</span><strong>{stats.pending}</strong><small>来自结账页和后台录入</small></article>
            <article><span>订单金额</span><strong>{money(stats.revenue)}</strong><small>前端演示统计</small></article>
            <article><span>管理员</span><strong>{users.length}</strong><small>{users.filter((user) => user.mustChangePassword).length} 个账号待改密</small></article>
          </section>
          <section className="admin-split">
            <div className="admin-panel"><div className="admin-panel-head"><h2>最新订单</h2><button type="button" disabled={!power.orders} onClick={() => setTab("orders")}>处理订单</button></div><div className="admin-order-list compact">{orders.slice(0, 4).map((order) => <article key={order.id}><img src={order.productImage} alt="" /><div><strong>{order.id}</strong><span>{order.customer.name} · {order.productTitle}</span></div><em>{order.status}</em></article>)}</div></div>
            <div className="admin-panel"><div className="admin-panel-head"><h2>账号状态</h2><button type="button" disabled={!power.users} onClick={() => setTab("users")}>管理权限</button></div><div className="admin-stock-list">{users.map((user) => <div key={user.id}><span>{user.name} · {roleLabel(user.role)}</span><strong>{user.mustChangePassword ? "待改密" : user.active ? "启用" : "停用"}</strong></div>)}</div></div>
          </section>
        </> : null}


        {tab === "content" ? (
          <form className="admin-content-layout" onSubmit={savePageContent}>
            <section className="admin-panel admin-content-panel">
              <div className="admin-panel-head">
                <div>
                  <h2>页面装修</h2>
                  <span>{contentStatus}</span>
                </div>
                <div className="admin-top-actions">
                  <button type="button" onClick={resetPageContent} disabled={!power.settings}>恢复默认</button>
                  <button className="admin-primary" type="submit" disabled={!power.settings}>{contentSaved ? "已保存" : "保存装修"}</button>
                </div>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>首页海报轮播</h3><span>图片、标题、按钮都可以替换；勾选“纯海报”时只展示整张图。</span></div>
                <div className="admin-editor-stack">
                  {(Array.isArray(pageContent.heroSlides) ? pageContent.heroSlides : []).map((slide, index) => (
                    <article className="admin-mini-editor admin-mini-editor--hero" key={`hero-${index}`}>
                      <img src={slide.image} alt="" />
                      <div className="admin-form-grid">
                        <label>标签文案<input value={slide.eyebrow || ""} onChange={(event) => updatePageList("heroSlides", index, "eyebrow", event.target.value)} /></label>
                        <label>主标题<input value={slide.title || ""} onChange={(event) => updatePageList("heroSlides", index, "title", event.target.value)} /></label>
                        <label>图片 URL<input value={slide.image?.startsWith("data:") ? "" : slide.image || ""} onChange={(event) => updatePageList("heroSlides", index, "image", event.target.value)} /></label>
                        <label>按钮文案<input value={slide.cta || ""} onChange={(event) => updatePageList("heroSlides", index, "cta", event.target.value)} /></label>
                        <label>按钮链接<input value={slide.href || ""} onChange={(event) => updatePageList("heroSlides", index, "href", event.target.value)} /></label>
                        <label>副按钮文案<input value={slide.secondaryCta || ""} onChange={(event) => updatePageList("heroSlides", index, "secondaryCta", event.target.value)} /></label>
                        <label>副按钮链接<input value={slide.secondaryHref || ""} onChange={(event) => updatePageList("heroSlides", index, "secondaryHref", event.target.value)} /></label>
                        <label>展示方式<select value={slide.posterOnly ? "poster" : "copy"} onChange={(event) => updatePageList("heroSlides", index, "posterOnly", event.target.value === "poster")}><option value="copy">图片叠加文案</option><option value="poster">纯海报整图</option></select></label>
                      </div>
                      <label className="admin-wide-label">描述<textarea value={slide.description || ""} onChange={(event) => updatePageList("heroSlides", index, "description", event.target.value)} /></label>
                      <label className="admin-file-button">替换海报图<input type="file" accept="image/*" onChange={(event) => chooseContentImage("heroSlides", index, event)} /></label>
                    </article>
                  ))}
                </div>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>服务承诺条</h3><span>对应首页海报下面的三个卖点卡片。</span></div>
                <div className="admin-editor-grid three">
                  {(Array.isArray(pageContent.servicePromises) ? pageContent.servicePromises : []).map((item, index) => (
                    <article className="admin-compact-editor" key={`promise-${index}`}>
                      <label>英文标签<input value={item.kicker || ""} onChange={(event) => updatePageList("servicePromises", index, "kicker", event.target.value)} /></label>
                      <label>标题<input value={item.title || ""} onChange={(event) => updatePageList("servicePromises", index, "title", event.target.value)} /></label>
                      <label>描述<textarea value={item.description || ""} onChange={(event) => updatePageList("servicePromises", index, "description", event.target.value)} /></label>
                    </article>
                  ))}
                </div>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>商店页头部</h3><span>对应商店页顶部的小标题、主标题和说明文案。</span></div>
                <div className="admin-form-grid">
                  <label>小标题<input value={editableContent.shopHero.eyebrow || ""} onChange={(event) => updatePageSection("shopHero", "eyebrow", event.target.value)} /></label>
                  <label>主标题<input value={editableContent.shopHero.title || ""} onChange={(event) => updatePageSection("shopHero", "title", event.target.value)} /></label>
                </div>
                <label className="admin-wide-label">说明文字<textarea value={editableContent.shopHero.description || ""} onChange={(event) => updatePageSection("shopHero", "description", event.target.value)} /></label>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>热门分类标题</h3><span>对应首页和商店页分类区块上方的标题文案。</span></div>
                <div className="admin-form-grid">
                  <label>区块小标题<input value={editableContent.categoryIntro.eyebrow || ""} onChange={(event) => updatePageSection("categoryIntro", "eyebrow", event.target.value)} /></label>
                  <label>区块标题<input value={editableContent.categoryIntro.title || ""} onChange={(event) => updatePageSection("categoryIntro", "title", event.target.value)} /></label>
                </div>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>热门分类</h3><span>左侧分类大图和说明会同步到首页分类板块。</span></div>
                <div className="admin-editor-grid two">
                  {(Array.isArray(pageContent.categories) ? pageContent.categories : []).map((item, index) => (
                    <article className="admin-mini-editor compact admin-mini-editor--category" key={`category-${index}`}>
                      <img src={item.image} alt="" />
                      <label>分类名称<input value={item.label || ""} onChange={(event) => updatePageList("categories", index, "label", event.target.value)} /></label>
                      <label>筛选值<input value={item.filter || ""} onChange={(event) => updatePageList("categories", index, "filter", event.target.value)} /></label>
                      <label>图片 URL<input value={item.image?.startsWith("data:") ? "" : item.image || ""} onChange={(event) => updatePageList("categories", index, "image", event.target.value)} /></label>
                      <label>描述<textarea value={item.description || ""} onChange={(event) => updatePageList("categories", index, "description", event.target.value)} /></label>
                      <label className="admin-file-button">替换分类图<input type="file" accept="image/*" onChange={(event) => chooseContentImage("categories", index, event)} /></label>
                    </article>
                  ))}
                </div>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>精选商品区</h3><span>控制首页热卖商品区的标题、说明和入口按钮。</span></div>
                <div className="admin-form-grid">
                  <label>区块标签<input value={editableContent.featured.eyebrow || ""} onChange={(event) => updatePageSection("featured", "eyebrow", event.target.value)} /></label>
                  <label>标题<input value={editableContent.featured.title || ""} onChange={(event) => updatePageSection("featured", "title", event.target.value)} /></label>
                  <label>按钮文案<input value={editableContent.featured.button || ""} onChange={(event) => updatePageSection("featured", "button", event.target.value)} /></label>
                  <label>按钮链接<input value={editableContent.featured.href || ""} onChange={(event) => updatePageSection("featured", "href", event.target.value)} /></label>
                </div>
                <label className="admin-wide-label">描述<textarea value={editableContent.featured.description || ""} onChange={(event) => updatePageSection("featured", "description", event.target.value)} /></label>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>评价滚动</h3><button type="button" onClick={() => addPageListItem("reviews", { rating: 5, text: "新的客户评价", name: "客户名称", location: "地区" })}>新增评价</button></div>
                <div className="admin-editor-stack">
                  {(Array.isArray(pageContent.reviews) ? pageContent.reviews : []).map((item, index) => (
                    <article className="admin-compact-editor admin-compact-editor--review" key={`review-${index}`}>
                      <div className="admin-form-grid">
                        <label>客户名称<input value={item.name || ""} onChange={(event) => updatePageList("reviews", index, "name", event.target.value)} /></label>
                        <label>地区<input value={item.location || ""} onChange={(event) => updatePageList("reviews", index, "location", event.target.value)} /></label>
                        <label>评分<input type="number" min="1" max="5" step="0.1" value={item.rating || 5} onChange={(event) => updatePageList("reviews", index, "rating", Number(event.target.value))} /></label>
                      </div>
                      <label className="admin-wide-label">评价内容<textarea value={item.text || ""} onChange={(event) => updatePageList("reviews", index, "text", event.target.value)} /></label>
                      <button type="button" onClick={() => removePageListItem("reviews", index)}>删除这条评价</button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>FAQ 问答</h3><button type="button" onClick={() => addPageListItem("faqs", { question: "新的问题", answer: "这里填写回答" })}>新增 FAQ</button></div>
                <div className="admin-editor-stack">
                  {(Array.isArray(pageContent.faqs) ? pageContent.faqs : []).map((item, index) => (
                    <article className="admin-compact-editor admin-compact-editor--faq" key={`faq-${index}`}>
                      <label>问题<input value={item.question || ""} onChange={(event) => updatePageList("faqs", index, "question", event.target.value)} /></label>
                      <label className="admin-wide-label">回答<textarea value={item.answer || ""} onChange={(event) => updatePageList("faqs", index, "answer", event.target.value)} /></label>
                      <button type="button" onClick={() => removePageListItem("faqs", index)}>删除这条 FAQ</button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="admin-editor-section">
                <div className="admin-editor-heading"><h3>订阅 CTA 与页脚</h3><span>页脚 Logo 每行一个，前台会自动排成 Logo 墙。</span></div>
                <div className="admin-form-grid">
                  <label>CTA 标签<input value={editableContent.newsletter.eyebrow || ""} onChange={(event) => updatePageSection("newsletter", "eyebrow", event.target.value)} /></label>
                  <label>CTA 标题<input value={editableContent.newsletter.title || ""} onChange={(event) => updatePageSection("newsletter", "title", event.target.value)} /></label>
                  <label>按钮文案<input value={editableContent.newsletter.button || ""} onChange={(event) => updatePageSection("newsletter", "button", event.target.value)} /></label>
                  <label>联系我们<input value={editableContent.newsletter.contact || ""} onChange={(event) => updatePageSection("newsletter", "contact", event.target.value)} /></label>
                  <label>页脚标题<input value={pageContent.footer.brandTitle || ""} onChange={(event) => updatePageSection("footer", "brandTitle", event.target.value)} /></label>
                  <label className="admin-wide-label admin-grid-span-2">合作展示 Logo<textarea value={(pageContent.footer.logos || []).join("\n")} onChange={(event) => updatePageSection("footer", "logos", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} /></label>
                </div>
                <label className="admin-wide-label">CTA 描述<textarea value={editableContent.newsletter.description || ""} onChange={(event) => updatePageSection("newsletter", "description", event.target.value)} /></label>
                <label className="admin-wide-label">页脚说明<textarea value={pageContent.footer.description || ""} onChange={(event) => updatePageSection("footer", "description", event.target.value)} /></label>
              </div>
            </section>
          </form>
        ) : null}

        {tab === "products" ? <section className="admin-products-layout">
          <form className="admin-panel admin-product-form" onSubmit={submitProduct}>
            <div className="admin-panel-head"><h2>{editingId ? "编辑商品" : "上架商品"}</h2>{editingId ? <button type="button" onClick={resetForm}>取消编辑</button> : null}</div>
            <div className="admin-form-grid">
              <label>商品名<input value={form.title} onChange={(event) => updateForm("title", event.target.value)} required /></label>
              <label>Slug<input value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} placeholder="自动生成或手动填写" /></label>
              <label>价格（美元 USD）<div className="admin-price-input"><input type="number" step="0.01" value={form.price ?? ""} onChange={(event) => updateForm("price", event.target.value)} placeholder="留空为定制报价" /><span>前台可切换 CNY</span></div><small className="admin-field-hint">后台价格按美元保存；前台价格旁可在 USD / CNY 间切换，人民币按实时或备用汇率换算。</small></label>
              <label>库存<input type="number" value={form.stock} onChange={(event) => updateForm("stock", event.target.value)} /></label>
              <label>分类<input value={form.category} onChange={(event) => updateForm("category", event.target.value)} /></label>
              <label>SKU（可填多个）<textarea value={form.sku} onChange={(event) => updateForm("sku", event.target.value)} placeholder="例：OUFAN-YELLOW, OUFAN-BLUE；多个 SKU 用逗号或换行分隔" /><small className="admin-field-hint">同一商品有多个颜色、尺码或渠道编码时，可以一次填多个 SKU。</small></label>
              <label>图片 URL<input value={form.image?.startsWith("data:") ? "" : form.image} onChange={(event) => updateProductImageUrl(event.target.value)} placeholder="可手动填写 URL，或用下方按钮选择本地图片" /></label>
              <label>标签<input value={form.tags} onChange={(event) => updateForm("tags", event.target.value)} /></label>
              <label>成本<input type="number" step="0.01" value={form.cost ?? ""} onChange={(event) => updateForm("cost", event.target.value)} /></label>
              <label>重量<input value={form.weight ?? ""} onChange={(event) => updateForm("weight", event.target.value)} placeholder="例如 0.35kg" /></label>
              <label>状态<select value={form.status} onChange={(event) => updateForm("status", event.target.value)}><option value="draft">草稿</option><option value="active">上架</option><option value="inactive">下架</option></select></label>
              <label>SEO 标题<input value={form.seoTitle ?? ""} onChange={(event) => updateForm("seoTitle", event.target.value)} /></label>
            </div>
            <div className="admin-image-picker">
              <div>
                <strong>商品图片</strong>
                <span>支持从本地目录多选图片，第一张自动作为主图</span>
              </div>
              <label className="admin-file-button">
                选择本地图片
                <input type="file" accept="image/*" multiple onChange={chooseProductImages} />
              </label>
              <div className="admin-image-preview">
                {(form.gallery?.length ? form.gallery : [form.image]).filter(Boolean).map((image, index) => (
                  <figure key={`${image}-${index}`}>
                    <img src={image} alt="" />
                    <figcaption>{index === 0 ? "主图" : `图 ${index + 1}`}</figcaption>
                    <button type="button" onClick={() => removeProductImage(index)}>移除</button>
                  </figure>
                ))}
              </div>
            </div>
            <label className="admin-wide-label">描述<textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} /></label>
            <label className="admin-wide-label">SEO 描述<textarea value={form.seoDescription ?? ""} onChange={(event) => updateForm("seoDescription", event.target.value)} /></label>
            {!power.publish ? <p className="admin-note">当前账号不能发布，上架状态会自动保存为草稿。</p> : null}
            <button className="admin-primary" type="submit">{editingId ? "保存商品" : "新增商品"}</button>
          </form>
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <h2>页面装修</h2>
                <span className="admin-cloud-status">{cloudStatus}</span>
              </div>
              <input className="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索商品、SKU、分类" />
            </div>
            <div className="admin-product-table">
              {visibleProducts.map((product) => {
                const originalIndex = items.findIndex((item) => item.id === product.id);
                return (
                  <article key={product.id}>
                    <img src={product.image} alt="" />
                    <div className="admin-product-info">
                      <strong>{product.title}</strong>
                      <span>{displaySku(product)} / {product.category} / 库存 {product.stock}</span>
                      {product.description ? <p>{product.description}</p> : null}
                      {product.productLink ? <a href={product.productLink} target="_blank" rel="noreferrer">商品链接</a> : <small>未填写商品链接</small>}
                    </div>
                    <b>{money(product.price)}</b>
                    <em className={`admin-status ${product.status}`}>{product.status}</em>
                    <div className="admin-row-actions">
                      <button type="button" disabled={originalIndex <= 0} onClick={() => moveProduct(product.id, -1)}>上移</button>
                      <button type="button" disabled={originalIndex < 0 || originalIndex >= items.length - 1} onClick={() => moveProduct(product.id, 1)}>下移</button>
                      <button type="button" onClick={() => editProduct(product)}>编辑</button>
                      <button type="button" disabled={!power.publish} onClick={() => setProductStatus(product, product.status === "active" ? "inactive" : "active")}>{product.status === "active" ? "下架" : "上架"}</button>
                      <button type="button" disabled={!power.remove} onClick={() => deleteProduct(product.id)}>删除</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section> : null}

        {tab === "orders" ? <section className="admin-panel"><div className="admin-panel-head"><h2>订单列表</h2><span>前台提交订单后会出现在这里</span></div><div className="admin-order-list">{orders.map((order) => <article key={order.id}><img src={order.productImage} alt="" /><div className="admin-order-main"><div><strong>{order.id}</strong><span>{time(order.createdAt)} · {order.source}</span></div><h3>{order.productTitle}</h3><p>{order.customer.name} · {order.customer.phone || "未填电话"} · {order.customer.address || "未填地址"}</p><small>{order.notes || "无备注"}</small></div><div className="admin-order-side"><b>{money(order.total)}</b><em className={`admin-status ${order.status}`}>{order.status}</em><span>数量 {order.quantity}</span></div><div className="admin-row-actions"><button type="button" onClick={() => updateOrder(order.id, { status: "accepted", fulfillmentStatus: "processing" }, "管理员接单")}>接单</button><button type="button" onClick={() => updateOrder(order.id, { status: "shipped", fulfillmentStatus: "shipped" }, "订单发货")}>发货</button><button type="button" onClick={() => updateOrder(order.id, { status: "completed", fulfillmentStatus: "fulfilled" }, "订单完成")}>完成</button><button type="button" onClick={() => updateOrder(order.id, { status: "cancelled" }, "订单取消")}>取消</button><button type="button" onClick={() => updateOrder(order.id, { status: "refund", paymentStatus: "refund" }, "申请退款")}>退款</button></div></article>)}</div></section> : null}

        {tab === "users" ? <section className={`admin-users-layout${showUserForm ? " is-form-open" : " is-list-only"}`}>
          {showUserForm ? (
            <form className="admin-panel admin-product-form" onSubmit={submitUser}>
              <div className="admin-panel-head"><h2>{editingUserId ? "编辑管理员" : "新增管理员"}</h2><button type="button" onClick={resetUserForm}>{editingUserId ? "取消编辑" : "收起"}</button></div>
              <div className="admin-form-grid">
                <label>姓名<input value={userForm.name} onChange={(event) => updateUserForm("name", event.target.value)} required /></label>
                <label>登录账号<input value={userForm.username} onChange={(event) => updateUserForm("username", event.target.value)} required /></label>
                <label>初始密码<input value={userForm.password} onChange={(event) => updateUserForm("password", event.target.value)} required /></label>
                <label>角色<select value={userForm.role} onChange={(event) => setUserRole(event.target.value)}><option value="manager">普通管理员</option><option value="super">超级管理员</option></select></label>
                <label>账号状态<select value={userForm.active ? "active" : "inactive"} onChange={(event) => updateUserForm("active", event.target.value === "active")}><option value="active">启用</option><option value="inactive">停用</option></select></label>
                <label>首次登录<select value={userForm.mustChangePassword ? "yes" : "no"} onChange={(event) => updateUserForm("mustChangePassword", event.target.value === "yes")}><option value="yes">强制修改密码</option><option value="no">不强制</option></select></label>
              </div>
              <div className="admin-permission-editor">
                {permissionCatalog.map(([key, label, description]) => <label key={key}><input type="checkbox" checked={Boolean(userForm.permissions?.[key])} onChange={() => togglePermission(key)} /><span><strong>{label}</strong><small>{description}</small></span></label>)}
              </div>
              <button className="admin-primary" type="submit">{editingUserId ? "保存管理员" : "创建管理员"}</button>
            </form>
          ) : null}
          <div className="admin-panel admin-user-list-panel"><div className="admin-panel-head"><div><h2>管理员列表</h2><span>超级管理员可分配每个普通管理员的具体权限</span></div><button type="button" className="admin-primary admin-compact-action" onClick={openNewUserForm}>新增管理员</button></div><div className="admin-user-table">{users.map((user) => <article key={user.id}><div><strong>{user.name}</strong><span>{user.username} · {roleLabel(user.role)}</span></div><em className={`admin-status ${user.active ? "active" : "inactive"}`}>{user.active ? "启用" : "停用"}</em><span>{user.mustChangePassword ? "首次登录待改密" : "密码已设置"}</span><div className="admin-permission-tags">{permissionCatalog.filter(([key]) => mergePermissions(user)[key]).map(([key, label]) => <b key={key}>{label}</b>)}</div><div className="admin-row-actions"><button type="button" onClick={() => editUser(user)}>编辑</button><button type="button" disabled={user.id === currentUser?.id} onClick={() => toggleUserActive(user.id)}>{user.active ? "停用" : "启用"}</button><button type="button" onClick={() => requirePasswordReset(user.id)}>要求改密</button></div></article>)}</div></div>
        </section> : null}

        {tab === "settings" ? (
          <form className="admin-panel" onSubmit={saveSettings}>
            <div className="admin-panel-head">
              <h2>系统设置</h2>
              <span>{power.settings ? "可编辑，保存后刷新仍会保留" : "当前账号无权编辑"}</span>
            </div>
            <div className="admin-form-grid">
              <label>
                店铺名称
                <input
                  value={settings.storeName}
                  onChange={(event) => updateSettings("storeName", event.target.value)}
                  disabled={!power.settings}
                  placeholder="例如 Oufan"
                />
                <small className="admin-field-hint">用于后台识别店铺，后续也可接到前台品牌名。</small>
              </label>
              <label>
                订单前缀
                <input
                  value={settings.orderPrefix}
                  onChange={(event) => updateSettings("orderPrefix", event.target.value)}
                  disabled={!power.settings}
                  placeholder="例如 OUFAN"
                />
              </label>
              <label>
                默认币种
                <select
                  value={settings.defaultCurrency}
                  onChange={(event) => updateSettings("defaultCurrency", event.target.value)}
                  disabled={!power.settings}
                >
                  <option value="USD">USD</option>
                  <option value="CNY">CNY</option>
                </select>
              </label>
              <label>
                库存预警
                <input
                  type="number"
                  min="0"
                  value={settings.stockWarning}
                  onChange={(event) => updateSettings("stockWarning", event.target.value)}
                  disabled={!power.settings}
                />
              </label>
            </div>
            {settingsSaved ? <p className="admin-save-success">设置已保存</p> : null}
            <button className="admin-primary" type="submit" disabled={!power.settings}>保存设置</button>
          </form>
        ) : null}
      </section>
    </main>
  );
}

