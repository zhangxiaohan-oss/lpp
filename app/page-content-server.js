import { getStore } from "@netlify/blobs";
import { categories, faqs, heroSlides, reviews, servicePromises } from "./data";

const STORE_NAME = "oufan-admin";
const CONTENT_KEY = "page-content";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function mergeList(savedList, defaultList) {
  if (!Array.isArray(savedList) || !savedList.length) return defaultList;
  return savedList
    .map((item, index) => ({ ...(defaultList[index] || {}), ...asObject(item) }))
    .filter((item) => Object.keys(item).length);
}

function getDefaultPageContent() {
  return {
    heroSlides: heroSlides.map((slide) => ({
      secondaryCta: "查看定制款",
      secondaryHref: "/shop?filter=custom",
      ...slide
    })),
    servicePromises: servicePromises.map((item) => ({ ...item })),
    categories: categories.map((item) => ({ ...item, productSlugs: Array.isArray(item.productSlugs) ? item.productSlugs : [] })),
    reviews: reviews.map((item) => ({ ...item })),
    faqs: faqs.map((item) => ({ ...item })),
    faqIntro: {
      eyebrow: "常见问题",
      title: "购买前先了解"
    },
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
    faqIntro: { ...defaults.faqIntro, ...asObject(source.faqIntro) },
    shopHero: { ...defaults.shopHero, ...asObject(source.shopHero) },
    categoryIntro: { ...defaults.categoryIntro, ...asObject(source.categoryIntro) },
    featured: { ...defaults.featured, ...asObject(source.featured) },
    newsletter: { ...defaults.newsletter, ...asObject(source.newsletter) },
    footer: { ...defaults.footer, ...asObject(source.footer) }
  };
}

export async function readPublishedPageContent() {
  try {
    const store = getStore(STORE_NAME);
    const saved = await store.get(CONTENT_KEY, { type: "json" });
    return mergePageContent(saved && typeof saved === "object" ? saved : {});
  } catch {
    return mergePageContent({});
  }
}
