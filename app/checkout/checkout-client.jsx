"use client";

import { useEffect, useMemo, useState } from "react";
import { Price } from "../currency";
import { products } from "../data";

const ADMIN_PRODUCTS_KEY = "lpp_admin_products";
const ADMIN_ORDERS_KEY = "lpp_admin_orders";

const emptyForm = { name: "", email: "", phone: "", address: "", notes: "" };

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("lpp-admin-orders-change"));
}

function getClientProducts() {
  const managedProducts = readJson(ADMIN_PRODUCTS_KEY, null);
  const source = Array.isArray(managedProducts) && managedProducts.length ? managedProducts : products;
  return source.map((product, index) => ({
    ...product,
    id: product







.id || `admin-${index + 1}`,
    slug: product.slug || `admin-product-${index + 1}`,
    title: product.title || "未命名商品",
    price: product.price === "" || product.price === null || product.price === undefined ? null : Number(product.price),
    image: product.image || "/assets/product-01.jpg",
    description: product.description || "后台上架商品，后续可接入真实商品详情。",
    tags: Array.isArray(product.tags) ? product.tags : []
  }));
}

export default function CheckoutClient({ initialProduct, productSlug, quantity }) {
  const [catalog, setCatalog] = useState(products);
  const [form, setForm] = useState(emptyForm);
  const [submittedOrder, setSubmittedOrder] = useState("");

  useEffect(() => {
 















   const syncCatalog = () => setCatalog(getClientProducts());
    syncCatalog();
    window.addEventListener("lpp-admin-products-change", syncCatalog);
    window.addEventListener("storage", syncCatalog);
    return () => {
      window.removeEventListener("lpp-admin-products-change", syncCatalog);
      window.removeEventListener("storage", syncCatalog);
    };
  }, []);

  const product = useMemo(() => catalog.find((item) => item.slug === productSlug) || initialProduct || null, [catalog, initialProduct, productSlug]);
 










 const total = product?.price ? Number(product.price) * quantity : null;

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitOrder(event) {
    event.preventDefault();
    if (!product) return;

 









   const now = new Date();
    const order = {
      id: `LPP${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getTime()).slice(-5)}`,
      createdAt: now.toISOString(),
      source: "购物网页",
      status: "pending",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
 







     productSlug: product.slug,
      productTitle: product.title,
      productImage: product.image,
      quantity,
      unitPrice: product.price,
      total,
      customer: {
 






       name: form.name || "未填写客户",
        email: form.email,
        phone: form.phone,
        address: form.address
      },
      notes: form.notes,
      timeline: [{ label: "客户提交订单", time: now.toISOString() }]







    };

    const orders = readJson(ADMIN_ORDERS_KEY, []);
    writeJson(ADMIN_ORDERS_KEY, [order, ...orders]);
    setSubmittedOrder(order.id);
  }







  return (
    <section className="checkout-page">
      <div>
        <p className="eyebrow">结账</p>
 




       <h1>填写购买信息</h1>
        <p>当前页面是前端购物流程演示。提交后会生成一条本地订单，后台管理页可以接收、接单和发货。</p>
        {product ? (
          <article className="checkout-product">
            <img src={product.image} alt={`${product.title} 商品图`} />
 




           <div>
              <h2>{product.title}</h2>
              <div className="price">
                <Price price={product.price} priceLabel={product.priceLabel} compact />
 



             </div>
              <span>数量：{quantity}</span>
            </div>
          </article>
 



       ) : (
          <div className="panel-empty">尚未选择商品。你可以先去商店选择一款商品。</div>
        )}
        {submittedOrder ? (
 



         <div className="checkout-success">
            订单 {submittedOrder} 已提交，可在 <a href="/admin">后台订单</a> 中处理。
          </div>
        ) : null}
 



     </div>
      <form className="checkout-form" onSubmit={submitOrder}>
        <label>姓名<input type="text" placeholder="请输入收货人姓名" value={form.name} onChange={(event) => updateField("name", event.target.value)} /></label>
 


       <label>邮箱<input type="email" placeholder="you@example.com" value={form.email} onChange={(event) => updateField("email", event.target.value)} /></label>
        <label>电话<input type="tel" placeholder="请输入联系电话" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} /></label>
        <label>收货地址<input type="text" placeholder="请输入收货地址" value={form.address} onChange={(event) => updateField("address", event.target.value)} /></label>


        <label>备注<textarea placeholder="定制 Logo、尺码、数量或其他需求" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
        <button className="button button-primary" type="submit" disabled={!product}>提交订单</button>
 


     </form>
    </section>
  )

;

}

