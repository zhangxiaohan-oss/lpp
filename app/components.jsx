"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Price } from "./currency";
import {
  categories,
  faqs,
  navItems,
  productPath,
  products,
  reviews,
  servicePromises,
  tagLabels
} from "./data";

const STORAGE_KEYS = {
  cart: "lpp_cart",
  wishlist: "lpp_wishlist",
  compare: "lpp_compare"
};

const CURRENCY_KEY = "lpp_currency";
const CURRENCY_EVENT = "lpp-currency-change";
const LANGUAGE_KEY = "lpp_language";
const LANGUAGE_EVENT = "lpp-language-change";

const currencyOptions = [
  { code: "CNY", label: "CN(CNY)", flag: "cn" },
  { code: "USD", label: "US(USD)", flag: "us" }
];

const languageOptions = [
  { code: "zh-CN", label: "简体中文" },
  { code: "en", label: "English" }
];

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
  window.dispatchEvent(new Event("lpp-store-change"));
}

function getCartCount() {
  const cart = readJson(STORAGE_KEYS.cart, {});
  return Object.values(cart).reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function getListCount(key) {
  return readJson(key, []).length;
}

function addToCart(slug, qty = 1) {
  const cart = readJson(STORAGE_KEYS.cart, {});
  const current = cart[slug]?.qty || 0;
  cart[slug] = { slug, qty: current + qty };
  writeJson(STORAGE_KEYS.cart, cart);
}

function toggleListItem(key, slug) {
  const current = readJson(key, []);
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  writeJson(key, next);
  return next.includes(slug);
}

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [counts, setCounts] = useState({ cart: 0, wishlist: 0, compare: 0 });
  const [currency, setCurrency] = useState("CNY");
  const [language, setLanguage] = useState("zh-CN");

  useEffect(() => {
    const syncCounts = () => {
      setCounts({
        cart: getCartCount(),
        wishlist: getListCount(STORAGE_KEYS.wishlist),
        compare: getListCount(STORAGE_KEYS.compare)
      });
    };

    syncCounts();
    window.addEventListener("storage", syncCounts);
    window.addEventListener("lpp-store-change", syncCounts);
    return () => {
      window.removeEventListener("storage", syncCounts);
      window.removeEventListener("lpp-store-change", syncCounts);
    };
  }, []);

  useEffect(() => {
    const syncPreferences = () => {
      setCurrency(window.localStorage.getItem(CURRENCY_KEY) === "USD" ? "USD" : "CNY");
      setLanguage(window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-CN");
    };

    syncPreferences();
    window.addEventListener("storage", syncPreferences);
    window.addEventListener(CURRENCY_EVENT, syncPreferences);
    window.addEventListener(LANGUAGE_EVENT, syncPreferences);
    return () => {
      window.removeEventListener("storage", syncPreferences);
      window.removeEventListener(CURRENCY_EVENT, syncPreferences);
      window.removeEventListener(LANGUAGE_EVENT, syncPreferences);
    };
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    const keyword = query.trim();
    window.location.href = keyword ? `/shop?keywords=${encodeURIComponent(keyword)}` : "/shop";
  }

  function selectCurrency(code) {
    window.localStorage.setItem(CURRENCY_KEY, code);
    setCurrency(code);
    window.dispatchEvent(new Event(CURRENCY_EVENT));
  }

  function selectLanguage(code) {
    window.localStorage.setItem(LANGUAGE_KEY, code);
    setLanguage(code);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  }

  const currentCurrency = currencyOptions.find((item) => item.code === currency) || currencyOptions[0];
  const currentLanguage = languageOptions.find((item) => item.code === language) || languageOptions[0];

  return (
    <>
      <div className="promo-strip">
        <strong>首次购买享 9 折优惠，使用优惠码：LPPBEACH</strong>
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
            item.children ? (
              <div className="nav-menu-item" key={item.href}>
                <a href={item.href}>
                  {item.label}
                  <Icon name="chevron" />
                </a>
                <div className="nav-menu-panel">
                  {item.children.map((child) => (
                    <a href={child.href} key={child.href}>
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            )
          ))}
        </nav>

        <div className="header-actions" aria-label="Shop utilities">
          <a className="header-cta" href="/customize">
            定制咨询
          </a>
          <form className="header-search-icon" onSubmit={submitSearch}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search hats"
              aria-label="Search products"
            />
            <button type="submit" aria-label="Search">
              <Icon name="search" />
            </button>
          </form>
          <a className="utility-icon" href="/wishlist" aria-label={`Wishlist, ${counts.wishlist} items`}>
            <Icon name="heart" />
            {counts.wishlist ? <span>{counts.wishlist}</span> : null}
          </a>
          <a className="utility-icon" href="/cart" aria-label={`Cart, ${counts.cart} items`}>
            <Icon name="cart" />
            {counts.cart ? <span>{counts.cart}</span> : null}
          </a>
          <a className="utility-icon" href="/checkout" aria-label="Account">
            <Icon name="user" />
          </a>
          <div className="preference-menu">
            <button className="currency-switch" type="button" aria-label="Currency selector">
              <span className={`flag-${currentCurrency.flag}`} aria-hidden="true"></span>
              {currentCurrency.label}
              <Icon name="chevron" />
            </button>
            <div className="preference-panel">
              {currencyOptions.map((item) => (
                <button type="button" key={item.code} onClick={() => selectCurrency(item.code)}>
                  <span className={`flag-${item.flag}`} aria-hidden="true"></span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <span className="header-divider" aria-hidden="true"></span>
          <div className="preference-menu">
            <button className="language-switch" type="button" aria-label="Language selector">
              {currentLanguage.label}
              <Icon name="chevron" />
            </button>
            <div className="preference-panel preference-panel-right">
              {languageOptions.map((item) => (
                <button type="button" key={item.code} onClick={() => selectLanguage(item.code)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <FloatingActions />
    </>
  );
}

function Icon({ name }) {
  const icons = {
    search: (
      <>
        <circle cx="11" cy="11" r="6"></circle>
        <path d="m16 16 4 4"></path>
      </>
    ),
    heart: <path d="M20.8 5.9c-1.8-2.1-5-1.7-6.8.4-1.8-2.1-5-2.5-6.8-.4-2 2.3-1 5.8 1.3 7.9L14 19l5.5-5.2c2.3-2.1 3.3-5.6 1.3-7.9Z"></path>,
    cart: (
      <>
        <path d="M6 7h15l-2 8H8L6 3H3"></path>
        <circle cx="9" cy="20" r="1.5"></circle>
        <circle cx="18" cy="20" r="1.5"></circle>
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 21c1.6-4 4.1-6 8-6s6.4 2 8 6"></path>
      </>
    ),
    chevron: <path d="m7 10 5 5 5-5"></path>
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function FloatingActions() {
  return (
    <div className="floating-actions" aria-label="快捷联系">
      <a href="#home" aria-label="返回顶部">
        <span>−</span>
      </a>
      <a href="mailto:hello@lppbeach.com" aria-label="邮件联系">
        <span>✉</span>
      </a>
      <a href="/contact" aria-label="在线咨询">
        <span>☎</span>
      </a>
      <a href="/contact" aria-label="微信咨询">
        <span>微</span>
      </a>
      <a href="/contact" aria-label="客服聊天">
        <span>聊</span>
      </a>
      <a href="#home" aria-label="回到顶部">
        <span>↑</span>
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a className="footer-showcase-brand" href="/" aria-label="LPP 草帽品牌展示站">
          <span>LPP</span>
          <strong>草帽品牌展示站</strong>
        </a>
        <p>面向海滩、冲浪、园艺、户外团队和品牌活动的草帽展示站，支持批发与 Logo 定制咨询。</p>
        <div className="footer-logo-wall" aria-label="示例品牌 Logo 展示">
          <span>COAST CLUB</span>
          <span>SURF LAB</span>
          <span>PALM DAY</span>
          <span>RGH</span>
          <span>KONA</span>
          <span>OUTDOOR CREW</span>
        </div>
      </div>
      <div className="footer-links">
        <a href="/shop">商店</a>
        <a href="/customize">定制服务</a>
        <a href="/tracking">订单追踪</a>
        <a href="/contact">联系我们</a>
      </div>
      <div className="footer-links">
        <a href="/wishlist">收藏夹</a>
        <a href="/compare">商品对比</a>
        <a href="/cart">购物车</a>
        <a href="/checkout">结账演示</a>
      </div>
    </footer>
  );
}

export function HeroSlider({ slides }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!slides?.length) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [slides]);

  if (!slides?.length) return null;
  const slide = slides[active];

  return (
    <section id="home" className="hero">
      <div className="hero-media">
        <img src={slide.image} alt={slide.title} />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <p>{slide.description}</p>
        <div className="hero-actions">
          <a className="button button-primary" href={slide.href}>
            {slide.cta}
          </a>
          <a className="button button-light" href="/shop?filter=custom">
            查看定制款
          </a>
        </div>
      </div>
      {slides.length > 1 ? (
        <div className="hero-dots" aria-label="切换海报">
          {slides.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={index === active ? "is-active" : ""}
              aria-label={`切换到第 ${index + 1} 张海报`}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function ServicePromises() {
  return (
    <section className="service-strip" aria-label="商店服务">
      {servicePromises.map((item, index) => (
        <article key={item.title}>
          <div className="service-index">
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div>
            <p>{item.kicker}</p>
            <h2>{item.title}</h2>
            <small>{item.description}</small>
          </div>
        </article>
      ))}
    </section>
  );
}

export function CategoryShowcase() {
  const categoryProducts = {
    beach: ["wholesale-custom-logo-surfing-beach-straw-hats", "unisex-beach-lifeguard-straw-hat", "custom-panama-beach-lifeguard-hat", "wholesale-american-beach-straw-hat", "fashion-custom-logo-beach-straw-hat", "plain-wide-brim-sun-hat"],
    lifeguard: ["american-style-lifeguard-straw-hats", "natural-straw-lifeguard-logo-print-hat", "custom-logo-patch-lifeguard-straw-hat", "applique-embroidered-logo-lifeguard-hat", "wide-brim-summer-fishing-straw-hat", "upf50-american-flag-surfing-hat"],
    surf: ["custom-printed-surfing-straw-hats", "striped-american-straw-hat", "upf50-american-flag-surfing-hat", "mens-fishing-surfing-logo-straw-hat", "american-style-lifeguard-straw-hats", "fashion-custom-logo-beach-straw-hat"],
    custom: ["customize", "custom-logo-patch-lifeguard-straw-hat", "fashion-custom-logo-beach-straw-hat", "wholesale-custom-logo-surfing-beach-straw-hats", "custom-printed-surfing-straw-hats", "natural-straw-lifeguard-logo-print-hat"]
  };

  return (
    <section className="category-section">
      <div className="section-heading">
        <p className="eyebrow">按场景选购</p>
        <h2>热门分类</h2>
      </div>
      <div className="category-feature-list">
        {categories.map((category) => (
          <article className="category-feature-row" key={category.filter}>
            <a className="category-feature-hero" href={`/shop?filter=${category.filter}`}>
              <img src={category.image} alt={category.label} />
              <span>{category.filter}</span>
              <h3>{category.label}</h3>
              <p>{category.description}</p>
            </a>
            <div className="category-feature-products">
              <div className="category-feature-heading">
                <h3>{category.label}精选</h3>
                <a href={`/shop?filter=${category.filter}`}>查看全部</a>
              </div>
              <div className="category-mini-grid">
                {(categoryProducts[category.filter] || [])
                  .map((slug) => products.find((product) => product.slug === slug))
                  .filter(Boolean)
                  .map((product) => (
                    <a className="category-mini-card" href={productPath(product)} key={product.slug}>
                      <img src={product.image} alt={product.title} />
                      <strong>{product.title}</strong>
                      <span className="mini-price">
                        <Price price={product.price} priceLabel={product.priceLabel} />
                      </span>
                    </a>
                  ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProductGrid({ limit, showTools = true, initialFilter = "all", initialSearch = "" }) {
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState("featured");

  useEffect(() => setSearch(initialSearch), [initialSearch]);
  useEffect(() => setFilter(initialFilter), [initialFilter]);

  const visibleProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const items = products.filter((product) => {
      const haystack = [product.title, product.description, product.tags.join(" ")].join(" ").toLowerCase();
      const tags = product.tags.map((tag) => tag.toLowerCase());
      return (!searchText || haystack.includes(searchText)) && (filter === "all" || tags.includes(filter));
    });

    const sorted =
      sort === "price-asc"
        ? items.slice().sort((a, b) => (a.price ?? 9999) - (b.price ?? 9999))
        : sort === "price-desc"
          ? items.slice().sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
          : sort === "rating"
            ? items.slice().sort((a, b) => b.rating - a.rating)
            : sort === "name"
              ? items.slice().sort((a, b) => a.title.localeCompare(b.title, "zh-CN"))
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
              placeholder="搜索商品、场景或定制方式"
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
              <option value="fishing">钓鱼户外</option>
            </select>
          </label>
          <label>
            <span>排序</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">推荐排序</option>
              <option value="rating">评分优先</option>
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
  const [wished, setWished] = useState(false);
  const [compared, setCompared] = useState(false);

  useEffect(() => {
    setWished(readJson(STORAGE_KEYS.wishlist, []).includes(product.slug));
    setCompared(readJson(STORAGE_KEYS.compare, []).includes(product.slug));
  }, [product.slug]);

  function handleAddToCart() {
    window.location.href = `/cart?product=${product.slug}`;
  }

  return (
    <article className="product-card">
      <a className="product-media" href={productPath(product)} aria-label={`查看${product.title}`}>
        <img src={product.image} alt={`${product.title} 商品图`} />
        <span className="quick-view">查看详情</span>
      </a>
      <div className="product-body">
        <div className="product-meta">
          <span className="product-category">草帽</span>
          <Rating rating={product.rating} count={product.reviewCount} />
        </div>
        <h3>
          <a href={productPath(product)}>{product.title}</a>
        </h3>
        <TagRow tags={product.tags.slice(0, 3)} />
        <div className="price">
          <Price price={product.price} priceLabel={product.priceLabel} />
        </div>
      </div>
      <div className="product-actions">
        <button type="button" onClick={handleAddToCart}>
          {product.price === null ? "询价定制" : "加入购物车"}
        </button>
        <button
          type="button"
          className={wished ? "is-active" : ""}
          aria-label={`将${product.title}加入收藏夹`}
          onClick={() => setWished(toggleListItem(STORAGE_KEYS.wishlist, product.slug))}
        >
          收藏
        </button>
        <button
          type="button"
          className={compared ? "is-active" : ""}
          aria-label={`将${product.title}加入对比`}
          onClick={() => setCompared(toggleListItem(STORAGE_KEYS.compare, product.slug))}
        >
          对比
        </button>
      </div>
    </article>
  );
}

export function ProductDetailView({ product, relatedProducts = [] }) {
  const [image, setImage] = useState(product.image);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [compared, setCompared] = useState(false);

  useEffect(() => {
    setWished(readJson(STORAGE_KEYS.wishlist, []).includes(product.slug));
    setCompared(readJson(STORAGE_KEYS.compare, []).includes(product.slug));
  }, [product.slug]);

  function handleCart() {
    window.location.href = `/cart?product=${product.slug}&qty=${qty}`;
  }

  function handleCheckout() {
    addToCart(product.slug, qty);
    window.location.href = `/checkout?product=${product.slug}&qty=${qty}`;
  }

  return (
    <>
      <section className="product-detail">
        <div className="product-detail-media">
          <img className="detail-main-image" src={image} alt={`${product.title} 商品图`} />
          <div className="thumb-row">
            {product.gallery.map((item) => (
              <button
                type="button"
                className={item === image ? "is-active" : ""}
                key={item}
                onClick={() => setImage(item)}
                aria-label="切换商品图片"
              >
                <img src={item} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">商品详情</p>
          <h1>{product.title}</h1>
          <Rating rating={product.rating} count={product.reviewCount} />
          <div className="price product-detail-price">
            <Price price={product.price} priceLabel={product.priceLabel} />
          </div>
          <p>{product.description}</p>
          <TagRow tags={product.tags} />
          <div className="quantity-row">
            <span>数量</span>
            <button type="button" onClick={() => setQty((current) => Math.max(1, current - 1))}>
              -
            </button>
            <strong>{qty}</strong>
            <button type="button" onClick={() => setQty((current) => current + 1)}>
              +
            </button>
          </div>
          <div className="detail-actions">
            <button className="button button-primary" type="button" onClick={handleCart}>
              加入购物车
            </button>
            <button className="button button-ghost" type="button" onClick={handleCheckout}>
              立即购买
            </button>
            <button
              className={`button button-ghost${wished ? " is-active" : ""}`}
              type="button"
              onClick={() => setWished(toggleListItem(STORAGE_KEYS.wishlist, product.slug))}
            >
              {wished ? "已收藏" : "收藏"}
            </button>
            <button
              className={`button button-ghost${compared ? " is-active" : ""}`}
              type="button"
              onClick={() => setCompared(toggleListItem(STORAGE_KEYS.compare, product.slug))}
            >
              {compared ? "已加入对比" : "加入对比"}
            </button>
          </div>
          <div className="detail-service-grid">
            {servicePromises.map((item) => (
              <span key={item.title}>{item.title}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-tabs">
        <details open>
          <summary>商品信息</summary>
          <p>{product.description}</p>
        </details>
        <details>
          <summary>配送与退换</summary>
          <p>常规现货支持快速发货；定制和批发订单将根据数量、工艺与目的地确认周期和运费。</p>
        </details>
        <details>
          <summary>定制说明</summary>
          <p>支持 Logo 贴章、帽底印花、帽绳、颜色和包装沟通。建议先提交数量和用途，便于确认报价。</p>
        </details>
      </section>

      <section className="shop-section">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">你可能也喜欢</p>
            <h2>相关商品</h2>
          </div>
          <a className="button button-ghost" href="/shop">
            查看全部
          </a>
        </div>
        <div className="product-grid">
          {relatedProducts.map((item) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>
      </section>
    </>
  );
}

export function ReviewsMarquee() {
  const reviewItems = [...reviews, ...reviews];
  return (
    <section className="testimonials">
      <div className="section-heading">
        <p className="eyebrow">真实反馈</p>
        <h2>卖家评价滚动展示</h2>
      </div>
      <div className="review-marquee" aria-label="客户评价">
        <div className="review-track">
          {reviewItems.map((review, index) => (
            <article className="review-card" key={`${review.name}-${index}`}>
              <Rating rating={review.rating} />
              <p>{review.text}</p>
              <strong>{review.name}</strong>
              <span>{review.location}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="faq-section">
      <div className="section-heading">
        <p className="eyebrow">常见问题</p>
        <h2>购买前先了解</h2>
      </div>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function NewsletterCta() {
  return (
    <section className="newsletter-cta">
      <div>
        <p className="eyebrow">展示与询价</p>
        <h2>准备好把草帽加入你的夏季货架了吗？</h2>
        <p>留下邮箱或直接前往定制页，告诉我们数量、Logo 方式和使用场景。</p>
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <input type="email" placeholder="you@example.com" aria-label="邮箱" />
        <button className="button button-primary" type="submit">
          订阅更新
        </button>
      </form>
      <a className="button button-ghost" href="/contact">
        联系我们
      </a>
    </section>
  );
}

export function StorageCollectionView({ type, initialProductSlug, initialQuantity = 1 }) {
  const initialized = useRef(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const key = STORAGE_KEYS[type];

    if (type === "cart" && initialProductSlug && !initialized.current) {
      initialized.current = true;
      addToCart(initialProductSlug, Number(initialQuantity) || 1);
    }

    const sync = () => {
      if (type === "cart") {
        const cart = readJson(key, {});
        setItems(
          Object.values(cart)
            .map((entry) => ({ product: products.find((item) => item.slug === entry.slug), qty: entry.qty }))
            .filter((entry) => entry.product)
        );
      } else {
        const slugs = readJson(key, []);
        setItems(slugs.map((slug) => products.find((item) => item.slug === slug)).filter(Boolean));
      }
    };

    sync();
    window.addEventListener("lpp-store-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lpp-store-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [type, initialProductSlug, initialQuantity]);

  if (!items.length) {
    return (
      <div className="panel-empty">
        暂时还没有商品。<a href="/shop">返回商店</a> 先挑一顶适合夏天的草帽。
      </div>
    );
  }

  if (type === "cart") {
    return (
      <div className="cart-list">
        {items.map(({ product, qty }) => (
          <article className="cart-summary" key={product.slug}>
            <img src={product.image} alt={`${product.title} 商品图`} />
            <div>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <div className="price">
                <Price price={product.price} priceLabel={product.priceLabel} />
              </div>
              <span className="cart-qty">数量：{qty}</span>
            </div>
            <a className="button button-primary" href={`/checkout?product=${product.slug}&qty=${qty}`}>
              去结算
            </a>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </div>
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

function Rating({ rating, count }) {
  return (
    <div className="rating" aria-label={`${rating} 星评分`}>
      <span>★★★★★</span>
      <strong>{Number(rating).toFixed(1)}</strong>
      {typeof count === "number" ? <em>({count})</em> : null}
    </div>
  );
}
