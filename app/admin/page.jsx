"use client";

import { useEffect, useMemo, useState } from "react";
import { products } from "../data";

const PRODUCT_KEY = "lpp_admin_products";
const ORDER_KEY = "lpp_admin_orders";
const USER_KEY = "lpp_admin_users";

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

const blankProduct = {
  title: "",
  slug: "",
  price: "",
  stock: 100,
  category: "草帽",
  image: "/assets/product-01.jpg",
  gallery: ["/assets/product-01.jpg"],
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
  window.localStorage.setItem(key, JSON.stringify(value));
  if (eventName) window.dispatchEvent(new Event(eventName));
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

function normalizeProduct(product, index) {
  const title = product.title || `商品 ${index + 1}`;
  const slug = product.slug || title.toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "") || `admin-product-${Date.now()}`;
  const tags = Array.isArray(product.tags) ? product.tags : String(product.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
  const image = product.image || (Array.isArray(product.gallery) && product.gallery[0]) || "/assets/product-01.jpg";
  return {
    ...product,
    id: product.id || `admin-${Date.now()}-${index}`,
    title,
    slug,
    sku: product.sku || `LPP-${String(index + 1).padStart(4, "0")}`,
    price: product.price === "" || product.price === null || product.price === undefined ? null : Number(product.price),
    stock: Number(product.stock ?? 0),
    image,
    gallery: Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [image],
    tags,
    status: product.status || "active",
    category: product.category || (tags.includes("lifeguard") ? "救生员帽" : tags.includes("surf") ? "冲浪系列" : "草帽"),
    rating: product.rating || 5,
    reviewCount: product.reviewCount || 0,
    adminManaged: product.adminManaged ?? true
  };
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

  const power = currentUser ? mergePermissions(currentUser) : rolePresets.super.permissions;
  const currentRoleLabel = currentUser ? roleLabel(currentUser.role) : "未登录";

  useEffect(() => {
    const savedUsers = readJson(USER_KEY, []);
    const initialUsers = savedUsers.length ? savedUsers : seedUsers();
    setUsers(initialUsers);
    if (!savedUsers.length) writeJson(USER_KEY, initialUsers, "lpp-admin-users-change");

    const savedProducts = readJson(PRODUCT_KEY, []);
    const initialProducts = savedProducts.length ? savedProducts.map((product, index) => normalizeProduct(product, index)) : seedProducts();
    setItems(initialProducts);
    if (!savedProducts.length) writeJson(PRODUCT_KEY, initialProducts, "lpp-admin-products-change");

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
    };
  }, []);

  const stats = useMemo(() => ({
    active: items.filter((item) => item.status === "active").length,
    pending: orders.filter((order) => order.status === "pending").length,
    revenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    low: items.filter((item) => Number(item.stock) <= 20).length
  }), [items, orders]);

  const visibleProducts = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return items;
    return items.filter((item) => [item.title, item.sku, item.category, item.status, item.tags?.join(" ")].join(" ").toLowerCase().includes(text));
  }, [items, query]);

  function saveProducts(nextItems) {
    setItems(nextItems);
    writeJson(PRODUCT_KEY, nextItems, "lpp-admin-products-change");
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
          {[["overview", "总览", true], ["products", "商品上架", power.products], ["orders", "订单管理", power.orders], ["users", "权限", power.users], ["settings", "设置", power.settings]].map(([key, label, enabled]) => (
            <button type="button" className={tab === key ? "is-active" : ""} key={key} disabled={!enabled} onClick={() => enabled && setTab(key)}>{label}</button>
          ))}
        </nav>
        <div className="admin-role-box"><span>当前账号</span><strong>{currentUser.name}</strong><small>{currentRoleLabel} · {currentUser.username}</small></div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div><p className="admin-kicker">Dashboard</p><h1>{tab === "overview" ? "经营总览" : tab === "products" ? "商品上架与库存" : tab === "orders" ? "订单接收与处理" : tab === "users" ? "账号权限" : "后台设置"}</h1></div>
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

        {tab === "products" ? <section className="admin-products-layout">
          <form className="admin-panel admin-product-form" onSubmit={submitProduct}>
            <div className="admin-panel-head"><h2>{editingId ? "编辑商品" : "上架商品"}</h2>{editingId ? <button type="button" onClick={resetForm}>取消编辑</button> : null}</div>
            <div className="admin-form-grid">
              <label>商品名<input value={form.title} onChange={(event) => updateForm("title", event.target.value)} required /></label>
              <label>Slug<input value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} placeholder="自动生成或手动填写" /></label>
              <label>价格<input type="number" step="0.01" value={form.price ?? ""} onChange={(event) => updateForm("price", event.target.value)} placeholder="留空为定制报价" /></label>
              <label>库存<input type="number" value={form.stock} onChange={(event) => updateForm("stock", event.target.value)} /></label>
              <label>分类<input value={form.category} onChange={(event) => updateForm("category", event.target.value)} /></label>
              <label>SKU<input value={form.sku} onChange={(event) => updateForm("sku", event.target.value)} /></label>
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
          <div className="admin-panel"><div className="admin-panel-head"><h2>商品列表</h2><input className="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索商品、SKU、分类" /></div><div className="admin-product-table">{visibleProducts.map((product) => <article key={product.id}><img src={product.image} alt="" /><div><strong>{product.title}</strong><span>{product.sku} · {product.category} · 库存 {product.stock}</span></div><b>{money(product.price)}</b><em className={`admin-status ${product.status}`}>{product.status}</em><div className="admin-row-actions"><button type="button" onClick={() => editProduct(product)}>编辑</button><button type="button" disabled={!power.publish} onClick={() => setProductStatus(product, product.status === "active" ? "inactive" : "active")}>{product.status === "active" ? "下架" : "上架"}</button><button type="button" disabled={!power.remove} onClick={() => deleteProduct(product.id)}>删除</button></div></article>)}</div></div>
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
          <div className="admin-panel admin-user-list-panel"><div className="admin-panel-head"><div><h2>管理员列表</h2><span>超级管理员可分配每个普通管理员的具体权限</span></div><button type="button" className="admin-primary admin-compact-action" onClick={openNewUserForm}>新增管理员</button></div><div className="admin-user-table">{users.map((user) => <article key={user.id}><div><strong>{user.name}</strong><span>{user.username} · {roleLabel(user.role)}</span></div><em className={`admin-status ${user.active ? "active" : "inactive"}`}>{user.active ? "启用" : "停用"}</em><span>{user.mustChangePassword ? "首次登录待改密" : "密码已设置"}</span><div className="admin-permission-tags">{permissionCatalog.filter(([key]) => mergePermissions(user)[key]).map(([key, label]) => <b key={key}>{label}</b>)}</div><div className="admin-row-actions"><button type="button" onClick={() => editUser(user)}>编辑</button><button type="button" disabled={user.id === currentUser.id} onClick={() => toggleUserActive(user.id)}>{user.active ? "停用" : "启用"}</button><button type="button" onClick={() => requirePasswordReset(user.id)}>要求改密</button></div></article>)}</div></div>
        </section> : null}

        {tab === "settings" ? <section className="admin-panel"><div className="admin-panel-head"><h2>系统设置</h2><span>{power.settings ? "可编辑" : "当前账号无权编辑"}</span></div><div className="admin-form-grid"><label>店铺名称<input defaultValue="LPP 草帽店" disabled={!power.settings} /></label><label>订单前缀<input defaultValue="LPP" disabled={!power.settings} /></label><label>默认币种<select defaultValue="USD" disabled={!power.settings}><option>USD</option><option>CNY</option></select></label><label>库存预警<input type="number" defaultValue="20" disabled={!power.settings} /></label></div><button className="admin-primary" type="button" disabled={!power.settings}>保存设置</button></section> : null}
      </section>
    </main>
  );
}
