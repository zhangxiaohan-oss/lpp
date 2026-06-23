"use client";

import { useMemo, useState } from "react";
import { Price } from "./currency";
import { navItems, productPath, products, tagLabels } from "./data";

export function Header() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <div className="promo-strip">
        <strong>首次购买享 9 折优惠，使用优惠码：WDPILLS23</strong>
      </div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="LPP 首页">
          <img src="/assets/source-hero.png" alt="LPP 草帽店标志" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={navOpen}
          aria-controls="site-nav"
          onClick={() => setNavOpen((current) => !current)}
        >
          菜单
        </button>
        <nav id="site-nav" className={`site-nav${navOpen ? " is-open" : ""}`} aria-label="主导航">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions" aria-label="商店操作">
          <a className="icon-button" href="/wishlist">
            收藏夹
          </a>
          <a className="icon-button" href="/compare">
            对比
          </a>
          <a className="cart-button" href="/cart">
            购物车
          </a>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand footer-brand" href="/">
          <img src="/assets/source-hero.png" alt="LPP 草帽店标志" />
        </a>
        <p>基于 LPP 草帽店公开页面和商品图片迁移而来的多页面电商展示站。</p>
      </div>
      <div className="footer-links">
        <a href="/shop">商店</a>
        <a href="/customize">定制服务</a>
        <a href="/tracking">订单追踪</a>
        <a href="/contact">联系</a>
      </div>
    </footer>
  );
}

export function ProductGrid({ limit, showTools = true, initialFilter = "all" }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState("featured");

  const visibleProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const items = products.filter((product) => {
      const haystack = [product.title, product.description, product.tags.join(" ")].join(" ").toLowerCase();
      const tags = product.tags.map((tag) => tag.toLowerCase());
      return (!searchText || haystack.includes(searchText)) && (filter === "all" || tags.includes(filter));
    });

    const sorted =
      sort === "price-asc"
        ? items.slice().sort((a, b) => (a.price ?? 999) - (b.price ?? 999))
        : sort === "price-desc"
          ? items.slice().sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
          : sort === "name"
            ? items.slice().sort((a, b) => a.title.localeCompare(b.title))
            : items;

    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  }, [filter, limit, search, sort]);

  return (
    <>
      {showTools ? (
        <div className="shop-tools">
          <label className="search-box">
            <span>搜索</span>
            <input
              type="search"
              placeholder="搜索商品"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label>
            <span>筛选</span>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">全部商品</option>
              <option value="custom">Logo 定制</option>
              <option value="lifeguard">救生员帽</option>
              <option value="beach">海滩帽</option>
              <option value="surf">冲浪与海滩</option>
              <option value="wholesale">批发采购</option>
            </select>
          </label>
          <label>
            <span>排序</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">推荐排序</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="name">名称 A-Z</option>
            </select>
          </label>
        </div>
      ) : null}

      <div className="product-grid" aria-live="polite">
        {visibleProducts.length ? (
          visibleProducts.map((product) => <ProductCard product={product} key={product.id} />)
        ) : (
          <div className="panel-empty">没有找到符合条件的商品。</div>
        )}
      </div>
    </>
  );
}

export function ProductCard({ product }) {
  return (
    <article className="product-card">
      <a className="product-media" href={productPath(product)} aria-label={`查看${product.title}`}>
        <img src={product.image} alt={`${product.title} 商品图`} />
        <span className="quick-view">查看详情</span>
      </a>
      <div className="product-body">
        <div className="product-category">草帽</div>
        <h3>
          <a href={productPath(product)}>{product.title}</a>
        </h3>
        <div className="price">
          <Price price={product.price} priceLabel={product.priceLabel} />
        </div>
      </div>
      <div className="product-actions">
        <a href={`/cart?product=${product.slug}`}>{product.price === null ? "询价定制" : "加入购物车"}</a>
        <a href="/wishlist" aria-label={`将${product.title}加入收藏夹`}>
          藏
        </a>
        <a href="/compare" aria-label={`将${product.title}加入对比`}>
          比
        </a>
      </div>
    </article>
  );
}

export function TagRow({ tags }) {
  return (
    <div className="tag-row">
      {tags.map((tag) => (
        <span key={tag}>{tagLabels[tag] || tag}</span>
      ))}
    </div>
  );
}
