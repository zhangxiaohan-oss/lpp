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

const ADMIN_PRODUCTS_KEY = "lpp_admin_products";
const CURRENCY_KEY = "lpp_currency";
const CURRENCY_EVENT = "lpp-currency-change";
const LANGUAGE_KEY = "lpp_language";
const LANGUAGE_EVENT = "lpp-language-change";
const SOCIAL_BINDINGS_KEY = "lpp_social_bindings";
const CHAT_HISTORY_KEY = "lpp_support_chat_history";
const ACCOUNT_SESSION_KEY = "oufan_account_session";

const currencyOptions = [
  { code: "CNY", label: "CN(CNY)", flag: "cn" },
  { code: "USD", label: "US(USD)", flag: "us" }
];

const languageOptions = [
  { code: "zh-CN", label: "简体中文" },
  { code: "en", label: "English" }
];

const translations = {
  "首页": "Home",
  "产品": "Products",
  "全部产品": "All Products",
  "海滩草帽": "Beach Straw Hats",
  "救生员帽": "Lifeguard Hats",
  "冲浪系列": "Surf Series",
  "Logo 定制": "Logo Custom",
  "新品上架": "New Arrival",
  "最新草帽": "Latest Straw Hats",
  "定制贴章款": "Custom Patch Styles",
  "冲浪精选": "Surf Picks",
  "热卖款": "Best sellers",
  "高评分热卖": "Top Rated",
  "批发采购款": "Bulk Order Picks",
  "海滩人气款": "Beach Favorites",
  "联系我们": "Contact us",
  "品牌故事": "BRAND STORY",
  "菜单": "Menu",
  "首次购买享 9 折优惠，使用优惠码：LPPBEACH": "Enjoy 10% off your first order with code: LPPBEACH",
  "定制咨询": "Custom Quote",
  "天然草编帽": "Natural Straw Hats",
  "戴上我们的草帽，保持清爽与有型": "Stay Cool and Sharp in Our Straw Hats",
  "为海滩、冲浪、钓鱼、园艺和户外工作设计的宽檐草帽，兼顾防晒、透气和品牌展示。": "Wide-brim straw hats for beach, surf, fishing, gardening, and outdoor work, designed for shade, breathability, and brand display.",
  "立即选购": "Shop Now",
  "查看定制款": "View Custom Styles",
  "批发与定制": "Wholesale & Custom",
  "让你的 Logo 出现在夏天最显眼的位置": "Put Your Logo Where Summer Gets Seen",
  "支持贴章、印花、帽底图案和团队采购，适合冲浪店、度假村、活动周边与户外团队。": "Supports patches, prints, under-brim artwork, and team purchasing for surf shops, resorts, events, and outdoor groups.",
  "咨询定制": "Request Custom Quote",
  "满 $30 免费配送": "Free Shipping Over $30",
  "天然材料优先": "Natural Materials First",
  "支持定制订单": "Custom Orders Ready",
  "按场景选购": "Shop by Scenario",
  "热门分类": "Popular Categories",
  "海滩草帽精选": "Beach Straw Hat Picks",
  "救生员帽精选": "Lifeguard Hat Picks",
  "冲浪系列精选": "Surf Series Picks",
  "Logo 定制精选": "Logo Custom Picks",
  "查看全部": "View All",
  "精选商品": "Featured Products",
  "热卖草帽": "Best-selling Straw Hats",
  "查看全部商品": "View All Products",
  "真实反馈": "Real Feedback",
  "卖家评价滚动展示": "Seller Reviews",
  "常见问题": "FAQ",
  "购买前先了解": "Know Before You Buy",
  "展示与询价": "Showcase & Quote",
  "准备好把草帽加入你的夏季货架了吗？": "Ready to Add Straw Hats to Your Summer Lineup?",
  "订阅更新": "Subscribe",
  "草帽品牌展示站": "Straw Hat Brand Showcase",
  "商店": "Shop",
  "收藏夹": "Wishlist",
  "商品对比": "Compare",
  "购物车": "Cart",
  "结账演示": "Checkout Demo"
};

Object.assign(translations, {
  "LPP 草帽店": "LPP Hat Shop",
  "LPP 草帽店 Next.js 多页面电商展示站，支持人民币价格、收藏、对比、购物车和定制咨询演示。": "LPP Hat Shop is a multi-page Next.js ecommerce showcase with RMB pricing, wishlist, comparison, cart, and custom quote demos.",
  "轻便透气，适合旅行、度假和日常防晒。": "Lightweight and breathable for travel, holidays, and everyday sun protection.",
  "宽檐遮阳，户外工作和冲浪场景都稳。": "Wide-brim shade that works well for outdoor jobs and surf settings.",
  "美式海岸气质，适合团队和活动采购。": "American coastal energy for teams, events, and bulk purchasing.",
  "贴章、印花、帽绳和批量方案可沟通。": "Patches, prints, chin cords, and bulk options can all be customized.",
  "常规商品支持快速发货，批量订单可单独确认运输方案。": "Standard items ship quickly; bulk orders can receive dedicated shipping plans.",
  "草编纹理、宽檐结构和透气帽身，适合长时间户外佩戴。": "Woven texture, a wide brim, and a breathable crown make it comfortable outdoors for long hours.",
  "Logo 贴章、颜色、帽绳、包装和数量需求都可以前端提交询价。": "Logo patches, colors, chin cords, packaging, and quantity requests can be submitted for a quote.",
  "从海滩到户外工作，挑一顶能遮阳、能出片、也能定制 Logo 的草帽。": "From the beach to outdoor work, choose a straw hat that shades well, photographs beautifully, and supports custom logos.",
  "面向海滩、冲浪、园艺、户外团队和品牌活动的草帽展示站，支持批发与 Logo 定制咨询。": "A straw hat showcase for beaches, surf, gardening, outdoor teams, and brand events, with wholesale and logo customization inquiries.",
  "定制服务": "Custom Service",
  "订单追踪": "Order Tracking",
  "返回顶部": "Back to top",
  "邮件联系": "Email us",
  "在线咨询": "Online support",
  "微信咨询": "WeChat",
  "客服聊天": "Chat",
  "回到顶部": "Back to top",
  "微": "WX",
  "聊": "Chat",
  "查看详情": "View Details",
  "草帽": "Straw Hat",
  "询价定制": "Request Quote",
  "加入购物车": "Add to Cart",
  "收藏": "Wishlist",
  "对比": "Compare",
  "搜索": "Search",
  "搜索商品、场景或定制方式": "Search products, scenarios, or customization options",
  "筛选": "Filter",
  "全部商品": "All Products",
  "海滩帽": "Beach Hats",
  "冲浪与海滩": "Surf & Beach",
  "批发采购": "Wholesale",
  "钓鱼户外": "Fishing & Outdoor",
  "排序": "Sort",
  "推荐排序": "Featured",
  "评分优先": "Top Rated",
  "价格从低到高": "Price: Low to High",
  "价格从高到低": "Price: High to Low",
  "名称 A-Z": "Name A-Z",
  "没有找到符合条件的商品。": "No matching products found.",
  "商品详情": "Product Details",
  "数量": "Quantity",
  "立即购买": "Buy Now",
  "已收藏": "Saved",
  "已加入对比": "Added to Compare",
  "加入对比": "Add to Compare",
  "商品信息": "Product Information",
  "配送与退换": "Shipping & Returns",
  "定制说明": "Customization Notes",
  "常规现货支持快速发货；定制和批发订单将根据数量、工艺与目的地确认周期和运费。": "In-stock items ship quickly. Custom and wholesale orders will have timelines and shipping fees confirmed by quantity, process, and destination.",
  "支持 Logo 贴章、帽底印花、帽绳、颜色和包装沟通。建议先提交数量和用途，便于确认报价。": "Logo patches, under-brim prints, chin cords, colors, and packaging can be customized. Share quantity and use case first so we can confirm pricing.",
  "你可能也喜欢": "You May Also Like",
  "相关商品": "Related Products",
  "客户评价": "Customer Reviews",
  "留下邮箱或直接前往定制页，告诉我们数量、Logo 方式和使用场景。": "Leave your email or go straight to the custom page and tell us your quantity, logo method, and use case.",
  "邮箱": "Email",
  "暂时还没有商品。": "No products yet.",
  "返回商店": "Back to Shop",
  "先挑一顶适合夏天的草帽。": "Pick a straw hat for summer first.",
  "去结算": "Checkout",
  "定制报价": "Custom Quote",
  "美元原价": "Original USD price",
  "按备用汇率换算": "Converted with fallback exchange rate",
  "关于 LPP": "About LPP",
  "为舒适户外而生的实用草帽": "Practical Straw Hats Made for Comfortable Outdoor Days",
  "LPP 专注海滩、冲浪、园艺、钓鱼和户外工作场景。我们希望草帽不只是遮阳工具，也能成为团队、品牌和夏季活动的视觉符号。": "LPP focuses on beach, surf, gardening, fishing, and outdoor work scenarios. We want straw hats to be more than sun protection; they can also become a visual symbol for teams, brands, and summer events.",
  "天然草编与真实编织质感": "Natural straw weaving with an authentic woven texture",
  "宽檐造型，提升遮阳覆盖": "Wide-brim shape for better sun coverage",
  "适合海滩、冲浪、钓鱼、园艺和户外工作": "Suitable for beaches, surf, fishing, gardening, and outdoor work",
  "支持批发与 Logo 定制": "Supports wholesale orders and logo customization",
  "购物车": "Cart",
  "确认你的商品": "Review Your Items",
  "这里是前端演示购物车，会保存你本次浏览器里加入的商品，适合展示购买流程。": "This is a front-end demo cart. It saves items added in this browser and is suitable for demonstrating the purchase flow.",
  "结账": "Checkout",
  "填写购买信息": "Enter Purchase Information",
  "当前页面为静态购买流程演示，可作为后续真实支付、地址和库存系统的入口。": "This static checkout demo can later connect to real payment, address, and inventory systems.",
  "尚未选择商品。你可以先去商店选择一款草帽。": "No product selected yet. You can choose a straw hat in the shop first.",
  "姓名": "Name",
  "请输入收货人姓名": "Enter recipient name",
  "电话": "Phone",
  "请输入联系电话": "Enter phone number",
  "收货地址": "Shipping Address",
  "请输入收货地址": "Enter shipping address",
  "备注": "Notes",
  "定制 Logo、尺码、数量或其他需求": "Custom logo, size, quantity, or other requirements",
  "提交订单": "Submit Order",
  "对比草帽款式": "Compare Straw Hat Styles",
  "你加入对比的商品会显示在这里，方便比较价格、标签、场景和详情。": "Products added for comparison appear here so you can review prices, tags, use cases, and details.",
  "告诉我们你的草帽需求": "Tell Us What You Need",
  "无论是样品、批发、Logo 定制还是展示合作，都可以先用这个前端表单整理需求。": "Whether you need samples, wholesale, logo customization, or showcase collaboration, this front-end form helps organize your request.",
  "先浏览商品": "Browse Products First",
  "请输入姓名": "Enter your name",
  "需求类型": "Request Type",
  "批发 / Logo 定制 / 样品 / 其他": "Wholesale / Logo Custom / Sample / Other",
  "需求说明": "Request Details",
  "数量、交期、Logo 方式、目标场景等": "Quantity, lead time, logo method, target scenario, etc.",
  "发送需求": "Send Request",
  "把你的品牌放进夏天的场景里": "Put Your Brand Into Summer Scenes",
  "适合冲浪店、度假村、户外团队、品牌活动和礼品采购。你可以提交数量、Logo 工艺、交期和包装需求，我们会按项目报价。": "Ideal for surf shops, resorts, outdoor teams, brand events, and gift sourcing. Submit quantity, logo process, lead time, and packaging needs, and we will quote by project.",
  "贴章、刺绣、印花、帽底图案均可沟通": "Patches, embroidery, prints, and under-brim artwork are all available",
  "支持不同帽绳、颜色、包装组合": "Supports different chin cords, colors, and packaging combinations",
  "适合批发采购和活动周边展示": "Suitable for wholesale purchasing and event merchandise displays",
  "提交定制需求": "Submit Custom Request",
  "最新上架的草编帽、救生员帽和 Logo 定制款，适合海边活动、户外团队和夏季品牌周边展示。": "Newly listed straw hats, lifeguard hats, and logo-custom styles for beach events, outdoor teams, and summer brand merchandise.",
  "新款推荐": "New Arrivals",
  "优先展示近期主推款式，保持与首页海边草帽品牌风格一致。": "A focused selection of recently featured styles that matches the beach straw hat brand feel of the homepage.",
  "从评分、评价数和批发适配度中筛出的热卖草帽，适合快速挑选展示和采购款。": "Best-selling straw hats selected by rating, review count, and wholesale suitability for quick demos and sourcing.",
  "热卖精选": "Best-selling Picks",
  "把更容易成交、展示感更强的款式放在这一页，便于临时演示给客户看。": "This page highlights styles with stronger sales appeal and clearer presentation value for quick customer demos.",
  "为夏天、海风和团队标识而做的草帽品牌": "A Straw Hat Brand Built for Summer, Sea Breeze, and Team Identity",
  "LPP 聚焦海滩、冲浪、园艺、户外工作和品牌活动场景，把宽檐遮阳、天然草编质感与 Logo": "LPP focuses on beaches, surf, gardening, outdoor work, and brand events, combining wide-brim sun protection, natural straw texture, and logo",
  "定制能力放在同一个展示体验里。": "customization in one cohesive showcase experience.",
  "这个站点用于展示商品、批发款式、定制方向和客户反馈。它不是冷冰冰的产品目录，而是让采购方快速理解“这顶帽子放到夏季活动里会是什么效果”。": "This site showcases products, wholesale styles, customization options, and customer feedback. It is not a cold product catalog; it helps buyers quickly understand how each hat will look in a summer event setting.",
  "全部商品": "All Products",
  "草帽商店": "Straw Hat Shop",
  "浏览所有草帽、救生员帽、海滩帽和批发定制款式。可搜索关键词、按场景筛选并查看人民币价格。": "Browse all straw hats, lifeguard hats, beach hats, and wholesale custom styles. Search by keyword, filter by scenario, and view prices in your selected currency.",
  "订单追踪": "Order Tracking",
  "查询你的订单": "Track Your Order",
  "输入订单编号和账单邮箱，即可查看购买后的订单状态。当前为前端演示表单，方便展示完整购物链路。": "Enter your order number and billing email to view order status. This is a front-end demo form for showing the full shopping flow.",
  "订单编号": "Order Number",
  "账单邮箱": "Billing Email",
  "查询订单": "Track Order",
  "收藏你喜欢的草帽": "Save Your Favorite Straw Hats",
  "你在商品卡或详情页点过的收藏会显示在这里，方便临时展示选品流程。": "Items saved from product cards or detail pages appear here, making it easy to demonstrate the selection flow.",
  "定制草帽": "Custom Straw Hat",
  "夏季成人冲浪海滩草帽批发定制": "Wholesale Custom Adult Summer Surf Beach Straw Hat",
  "美式救生员冲浪草帽": "American-style Lifeguard Surf Straw Hat",
  "素色宽檐户外遮阳草帽": "Plain Wide-brim Outdoor Sun Straw Hat",
  "自然草编 Logo 印花救生员帽": "Natural Straw Lifeguard Hat with Logo Print",
  "宽檐钓鱼冲浪草帽": "Wide-brim Fishing and Surf Straw Hat",
  "Logo 贴章救生员草帽": "Lifeguard Straw Hat with Logo Patch",
  "男女通用海滩救生员草帽": "Unisex Beach Lifeguard Straw Hat",
  "刺绣 Logo 救生员草帽": "Lifeguard Straw Hat with Embroidered Logo",
  "巴拿马海滩风定制草帽": "Custom Panama-style Beach Straw Hat",
  "高品质冲浪草帽批发定制": "High-quality Wholesale Custom Surf Straw Hat",
  "时尚 Logo 海滩草帽": "Fashion Beach Straw Hat with Custom Logo",
  "条纹美式冲浪草帽": "Striped American Surf Straw Hat",
  "美式海滩草帽批发": "Wholesale American Beach Straw Hat",
  "UPF 50 美国旗冲浪草帽": "UPF 50 American Flag Surf Straw Hat",
  "男士钓鱼冲浪 Logo 草帽": "Men's Fishing and Surf Straw Hat with Logo",
  "可选择颜色和尺码，并将订单需求提交给客服。批发价：50-200 件每件 $6.19，200-500 件每件 $4.50，500 件以上每件 $3.50，运费另行报价。": "Choose colors and sizes, then submit your order requirements to customer service. Wholesale pricing: $6.19 each for 50-200 pieces, $4.50 each for 200-500 pieces, and $3.50 each for 500+ pieces. Shipping is quoted separately.",
  "适合批量采购的夏季草帽，支持 Logo 定制，自然镂空草编结构，男女通用。": "A summer straw hat for bulk purchasing, with logo customization, natural open-weave construction, and a unisex fit.",
  "美式救生员草帽，主打夏季遮阳、防晒和冲浪文化，可支持 Logo 印花定制。": "An American-style lifeguard straw hat designed for summer shade, sun protection, and surf culture, with custom logo printing available.",
  "素色宽檐遮阳帽，适合救生员、农场、园艺和日常户外防晒。": "A plain wide-brim sun hat for lifeguards, farms, gardening, and everyday outdoor sun protection.",
  "自然草编救生员帽，采用美式宽檐造型，适合批发和 Logo 印花定制。": "A natural straw lifeguard hat with an American wide-brim shape, suitable for wholesale and custom logo printing.",
  "宽檐编织草帽，适合海滩、救生员、冲浪、狩猎和钓鱼等户外使用。": "A wide-brim woven straw hat for beaches, lifeguards, surfing, hunting, fishing, and other outdoor uses.",
  "自然草编救生员遮阳帽，支持定制 Logo 贴章，适合批发订单。": "A natural straw lifeguard sun hat with custom logo patch support, ideal for wholesale orders.",
  "男女通用宽檐海滩帽，主打防晒、美式造型和定制 Logo 贴章印花。": "A unisex wide-brim beach hat focused on sun protection, American styling, and custom logo patch or print options.",
  "救生员草帽款式，支持贴布刺绣 Logo，适合夏季品牌活动和团体使用。": "A lifeguard straw hat style with applique embroidered logo support, suitable for summer brand events and group use.",
  "自然草编夏季遮阳帽，适合救生员、冲浪探险、巴拿马海滩造型和 Logo 定制。": "A natural straw summer sun hat for lifeguards, surf adventures, Panama-inspired beach looks, and logo customization.",
  "支持定制印花的草帽，适合夏季冲浪、海滩和救生员场景，突出品牌 Logo 展示。": "A custom-print straw hat for summer surf, beach, and lifeguard scenarios, designed to highlight brand logos.",
  "时尚男女通用海滩草帽，融合自然草编、冲浪和救生员风格。": "A stylish unisex beach straw hat blending natural straw texture with surf and lifeguard styling.",
  "宽檐条纹美式草帽，适合海滩、冲浪、防晒、救生员和户外 Logo 定制。": "A wide-brim striped American straw hat for beaches, surfing, sun protection, lifeguards, and outdoor logo customization.",
  "夏季救生员草帽批发款，采用美式海滩帽造型。": "A wholesale summer lifeguard straw hat with an American beach-hat silhouette.",
  "宽檐草帽，适合男女和青少年，主打 UPF 50 防晒和蓝黑美国旗冲浪风格。": "A wide-brim straw hat for adults and youth, featuring UPF 50 sun protection and a blue-black American flag surf style.",
  "男士救生员海滩遮阳草帽，适合钓鱼和冲浪，可定制贴章和帽底 Logo 印花。": "A men's lifeguard beach sun straw hat for fishing and surfing, with custom patches and under-brim logo printing available.",
  "海边冲浪俱乐部采购": "Coastal Surf Club Buyer",
  "度假村礼品店": "Resort Gift Shop",
  "户外团队负责人": "Outdoor Team Lead",
  "花园市集摊主": "Garden Market Vendor",
  "厦门": "Xiamen",
  "三亚": "Sanya",
  "杭州": "Hangzhou",
  "成都": "Chengdu",
  "帽檐够宽，Logo 贴章效果很清楚。我们做活动周边，现场拍照特别出片。": "The brim is wide enough, and the logo patch looks crisp. We used them for event merchandise, and they photographed beautifully on site.",
  "客人很喜欢这种自然草编质感，比普通遮阳帽更有度假感，补货沟通也顺。": "Guests love the natural woven texture. It feels more resort-ready than ordinary sun hats, and restocking was smooth.",
  "试戴一整天没有闷，帽绳很实用。批量采购前先看样，这个页面展示很直观。": "I wore it all day without feeling stuffy, and the chin cord is practical. The page makes sample review before bulk purchasing very clear.",
  "宽檐防晒是真的舒服，浅色衣服也很好搭。后面准备做定制包装。": "The wide brim is genuinely comfortable for sun protection, and it pairs well with light outfits. We plan to add custom packaging next.",
  "可以定制 Logo 吗？": "Can I customize the logo?",
  "可以。常见方式包括贴章、刺绣、印花和帽底图案，适合品牌活动、冲浪店、度假村和团队采购。": "Yes. Common options include patches, embroidery, printing, and under-brim artwork for brand events, surf shops, resorts, and team orders.",
  "价格为什么有些显示定制报价？": "Why do some items show custom quote pricing?",
  "定制款会受到数量、工艺、包装和运输方式影响，因此需要先提交需求再确认最终报价。": "Custom items depend on quantity, process, packaging, and shipping method, so requirements must be submitted before final pricing is confirmed.",
  "页面里的人民币价格实时吗？": "Are the RMB prices on the page real-time?",
  "页面会优先请求实时美元兑人民币汇率；如果网络不可用，会用备用汇率继续展示，避免页面空白。": "The page first requests a real-time USD-to-CNY exchange rate. If the network is unavailable, it uses a fallback rate so the page never appears blank.",
  "这个网站可以真实下单吗？": "Can I place a real order on this website?",
  "当前是前端展示版本，购物车、收藏、对比和结账流程用于演示。后续可以接入真实支付、库存和账户系统。": "This is currently a front-end showcase. Cart, wishlist, comparison, and checkout are for demonstration. Real payment, inventory, and account systems can be added later.",
  "定制": "Custom",
  "批发": "Wholesale",
  "冲浪": "Surf",
  "救生员": "Lifeguard",
  "户外": "Outdoor",
  "钓鱼": "Fishing",
  "海滩": "Beach",
  "UPF 防晒": "UPF Sun Protection"
});

const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([zh, en]) => [en, zh]));

function translateCopy(text, language) {
  if (language === "en") return translations[text] || text;
  return reverseTranslations[text] || text;
}

function preserveWhitespace(original, replacement) {
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";
  return `${leading}${replacement}${trailing}`;
}

function applyDocumentLanguage(language) {
  if (typeof document === "undefined") return;
  const dictionary = language === "en" ? translations : reverseTranslations;
  const titleKey = document.title.trim();
  if (dictionary[titleKey]) {
    document.title = dictionary[titleKey];
  } else if (language === "en" && titleKey.includes("LPP 草帽店")) {
    document.title = titleKey.replace("LPP 草帽店", "LPP Hat Shop");
  } else if (language !== "en" && titleKey.includes("LPP Hat Shop")) {
    document.title = titleKey.replace("LPP Hat Shop", "LPP 草帽店");
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT", "SVG"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const key = node.nodeValue.trim();
    if (dictionary[key]) {
      node.nodeValue = preserveWhitespace(node.nodeValue, dictionary[key]);
    } else if (language === "en" && key.startsWith("数量：")) {
      node.nodeValue = preserveWhitespace(node.nodeValue, key.replace("数量：", "Qty: "));
    } else if (language !== "en" && key.startsWith("Qty: ")) {
      node.nodeValue = preserveWhitespace(node.nodeValue, key.replace("Qty: ", "数量："));
    } else if (language === "en" && key.endsWith("星评分")) {
      node.nodeValue = preserveWhitespace(node.nodeValue, key.replace("星评分", "star rating"));
    } else if (language !== "en" && key.endsWith("star rating")) {
      node.nodeValue = preserveWhitespace(node.nodeValue, key.replace("star rating", "星评分"));
    }
  });

  document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((field) => {
    const next = dictionary[field.getAttribute("placeholder")];
    if (next) field.setAttribute("placeholder", next);
  });
}

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
function getClientProducts({ includeInactive = false } = {}) {
  const managedProducts = readJson(ADMIN_PRODUCTS_KEY, null);
  const source = Array.isArray(managedProducts) && managedProducts.length ? managedProducts : products;

  return source
    .filter((product) => includeInactive || (product.status || "active") === "active")
    .map((product, index) => {
      const image = product.image || "/assets/product-01.jpg";
      const tags = Array.isArray(product.tags)
        ? product.tags
        : String(product.tags || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

      return {
        ...product,
        id: product.id || `admin-${index + 1}`,
        slug: product.slug || `admin-product-${index + 1}`,
        title: product.title || "未命名商品",
        price: product.price === "" || product.price === null || product.price === undefined ? null : Number(product.price),
        image,
        tags,
        description: product.description || "后台上架商品，后续可接入真实商品详情。",
        rating: product.rating || 5,
        reviewCount: product.reviewCount || 0,
        badges: product.badges || ["后台上架"],
        gallery: Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [image],
        adminManaged: Boolean(product.adminManaged)
      };
    });
}












export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [counts, setCounts] = useState({ cart: 0, wishlist: 0, compare: 0 });
  const [currency, setCurrency] = useState("CNY");
  const [language, setLanguage] = useState("zh-CN");
  const [accountOpen, setAccountOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportChannel, setSupportChannel] = useState("whatsapp");

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
    document.documentElement.lang = language === "en" ? "en" : "zh-CN";
    window.requestAnimationFrame(() => applyDocumentLanguage(language));
  }, [language]);

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
          <img src="/assets/oufan-logo.jpg" alt="Oufan 草帽品牌标志" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={navOpen}
          aria-controls="site-nav"
          onClick={() => setNavOpen((current) => !current)}
        >
          {translateCopy("菜单", language)}
        </button>

        <nav id="site-nav" className={`site-nav${navOpen ? " is-open" : ""}`} aria-label="主导航">
          {navItems.map((item) => (
            item.children ? (
              <div className="nav-menu-item" key={item.href}>
                <a href={item.href}>
                  {translateCopy(item.label, language)}
                  <Icon name="chevron" />
                </a>
                <div className="nav-menu-panel">
                  {item.children.map((child) => (
                    <a href={child.href} key={child.href}>
                      {translateCopy(child.label, language)}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a href={item.href} key={item.href}>
                {translateCopy(item.label, language)}
              </a>
            )
          ))}
        </nav>

        <div className="header-actions" aria-label="Shop utilities">
          <a className="header-cta" href="/customize">
            {translateCopy("定制咨询", language)}
          </a>
          <form className="header-search-icon" onSubmit={submitSearch}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={language === "en" ? "Search hats" : "搜索草帽"}
              aria-label={language === "en" ? "Search products" : "搜索商品"}
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
          <button
            className="utility-icon"
            type="button"
            aria-label={language === "en" ? "Account center" : "个人中心"}
            onClick={() => setAccountOpen(true)}
          >
            <Icon name="user" />
          </button>
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
      <FloatingActions
        onOpenSupport={(channel) => {
          setSupportChannel(channel);
          setSupportOpen(true);
        }}
      />
      <AccountPanel open={accountOpen} onClose={() => setAccountOpen(false)} language={language} />
      <SupportChatPanel
        open={supportOpen}
        initialChannel={supportChannel}
        onClose={() => setSupportOpen(false)}
        language={language}
      />
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
    chevron: <path d="m7 10 5 5 5-5"></path>,
    minus: <path d="M6 12h12"></path>,
    mail: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2"></rect>
        <path d="m5 8 7 5 7-5"></path>
      </>
    ),
    arrowUp: (
      <>
        <path d="M12 19V5"></path>
        <path d="m6 11 6-6 6 6"></path>
      </>
    ),
    whatsapp: (
      <>
        <path d="M6.7 18.5 4 20l.8-3.1A8 8 0 1 1 12 20a8.3 8.3 0 0 1-5.3-1.5Z"></path>
        <path d="M9.4 8.6c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.3 2.1 3.3 5.2 4.4 2.6.9 3.1.7 3.7.7.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.7-.5l-2-1c-.4-.1-.6-.1-.8.2l-.8 1c-.2.2-.4.3-.8.1-.4-.2-1.5-.6-2.8-1.7-1-1-1.7-2.1-1.9-2.5-.2-.3 0-.5.2-.7l.5-.6c.2-.2.2-.3.4-.6.1-.2.1-.4 0-.6l-.9-2.1Z"></path>
      </>
    ),
    messenger: (
      <>
        <path d="M12 4C7 4 3.2 7.5 3.2 12.1c0 2.6 1.2 4.9 3.2 6.3V21l2.9-1.6c.8.2 1.7.3 2.7.3 5 0 8.8-3.5 8.8-8.1C20.8 7.5 17 4 12 4Z"></path>
        <path d="m7.2 14.4 3-3.2 2.4 2.2 4.2-4.4-3.2 5.6-2.5-2.2-3.9 2Z"></path>
      </>
    ),
    facebook: <path d="M14.2 8.1h2.2V4.4c-.4-.1-1.8-.2-3.3-.2-3.3 0-5.5 2-5.5 5.8v3.2H4v4.1h3.6V24H12v-6.7h3.5l.6-4.1H12v-2.8c0-1.2.3-2.3 2.2-2.3Z"></path>
  };

  return (
    <svg className={`icon icon-${name}`} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function FloatingActions({ onOpenSupport }) {
  return (
    <div className="floating-actions" aria-label="快捷联系">
      <a className="floating-action-neutral" href="#home" aria-label="收起快捷联系">
        <Icon name="minus" />
      </a>
      <button className="floating-action-whatsapp" type="button" aria-label="WhatsApp 客服演示" onClick={() => onOpenSupport("whatsapp")}>
        <Icon name="whatsapp" />
      </button>
      <button className="floating-action-messenger" type="button" aria-label="Messenger 客服演示" onClick={() => onOpenSupport("messenger")}>
        <Icon name="messenger" />
      </button>
      <button className="floating-action-facebook" type="button" aria-label="Facebook 登录绑定" onClick={() => onOpenSupport("facebook")}>
        <Icon name="facebook" />
      </button>
      <a className="floating-action-mail" href="mailto:hello@lppbeach.com" aria-label="邮件联系">
        <Icon name="mail" />
      </a>
      <a className="floating-action-neutral" href="#home" aria-label="回到顶部">
        <Icon name="arrowUp" />
      </a>
    </div>
  );
}

function readAccountSession() {
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNT_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

const authProviders = [
  { key: "gmail", name: "Gmail", badge: "G", className: "provider-gmail", authPath: "/api/auth/google", configLabel: "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET" },
  { key: "whatsapp", name: "WhatsApp", badge: "WA", className: "provider-whatsapp", authPath: "/api/auth/whatsapp", configLabel: "WHATSAPP_BUSINESS_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN" },
  { key: "facebook", name: "Facebook", badge: "FB", className: "provider-facebook", authPath: "/api/auth/facebook", configLabel: "META_APP_ID / META_APP_SECRET" },
  { key: "messenger", name: "Messenger", badge: "MS", className: "provider-messenger", authPath: "/api/auth/messenger", configLabel: "FACEBOOK_PAGE_ID / MESSENGER_PAGE_ACCESS_TOKEN" }
];

const providerCopy = {
  gmail: { zh: "使用 Gmail / Google 账号验证并注册。", en: "Verify and register with a Gmail / Google account." },
  whatsapp: { zh: "通过 WhatsApp 手机号验证码完成注册绑定。", en: "Register and bind by verifying a WhatsApp phone number." },
  facebook: { zh: "通过 Facebook Login 完成身份授权。", en: "Authorize identity through Facebook Login." },
  messenger: { zh: "通过 Messenger / Facebook Page 对话身份完成客服绑定。", en: "Bind support identity through Messenger / Facebook Page conversation." }
};

function AccountPanel({ open, onClose, language }) {
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState("login");
  const [notice, setNotice] = useState("");
  const isEnglish = language === "en";
  const text = (zh, en) => (isEnglish ? en : zh);

  useEffect(() => {
    if (!open) return;
    setSession(readAccountSession());
    fetch("/api/account/session")
      .then((response) => response.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
          window.localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(data.session));
        }
      })
      .catch(() => {});
    setNotice("");
  }, [open]);

  function startProviderAuth(provider) {
    setNotice(text("正在进入 " + provider.name + " 授权入口...", "Opening " + provider.name + " authorization..."));
    window.location.href = provider.authPath;
  }

  function logout() {
    fetch("/api/account/logout", { method: "POST" }).catch(() => {});
    window.localStorage.removeItem(ACCOUNT_SESSION_KEY);
    setSession(null);
  }

  if (!open) return null;
  const boundProviders = session?.boundProviders || [];

  return (
    <div className="support-overlay" role="dialog" aria-modal="true" aria-labelledby="account-panel-title">
      <div className="support-panel account-panel">
        <button className="support-close" type="button" onClick={onClose} aria-label={text("关闭个人中心", "Close account center")}>×</button>
        <div className="support-intro account-intro">
          <p className="eyebrow">{text("个人中心", "Account Center")}</p>
          <h2 id="account-panel-title">{session ? text("我的账户", "My Account") : text("登录或注册 Oufan 账户", "Log In or Create an Oufan Account")}</h2>
          <p>{text("这里用于管理个人信息、钱包、第三方绑定和用户协议。", "Manage profile, wallet, third-party bindings, and user agreements here.")}</p>
        </div>

        {session ? (
          <div className="account-dashboard">
            <section className="account-card account-profile-card">
              <div className="account-avatar">{session.name?.slice(0, 1) || "U"}</div>
              <div>
                <p className="eyebrow">{text("个人信息", "Profile")}</p>
                <h3>{session.name || text("Oufan 用户", "Oufan User")}</h3>
                <p>{session.email || text("尚未绑定邮箱", "No email bound yet")}</p>
                <small>{text("会员编号", "Member ID")}: {session.id || "OUFAN-USER"}</small>
              </div>
            </section>
            <section className="account-card">
              <p className="eyebrow">{text("钱包", "Wallet")}</p>
              <h3>¥{session.walletBalance || "0.00"}</h3>
              <p>{text("优惠券、积分、退款余额和批发账期会显示在这里。", "Coupons, points, refund balance, and wholesale credit terms appear here.")}</p>
            </section>
            <section className="account-card">
              <p className="eyebrow">{text("已绑定方式", "Bound Methods")}</p>
              <div className="account-provider-list">
                {authProviders.map((provider) => <span className={boundProviders.includes(provider.key) ? "is-bound" : ""} key={provider.key}>{provider.name}</span>)}
              </div>
            </section>
            <section className="account-card account-agreement-card">
              <p className="eyebrow">{text("用户协议", "Agreements")}</p>
              <a href="/contact">{text("用户服务协议", "Terms of Service")}</a>
              <a href="/contact">{text("隐私政策", "Privacy Policy")}</a>
              <a href="/contact">{text("退款与售后政策", "Refund and Support Policy")}</a>
            </section>
            <button className="account-logout" type="button" onClick={logout}>{text("退出登录", "Log Out")}</button>
          </div>
        ) : (
          <div className="account-auth-layout">
            <div className="account-auth-tabs" role="tablist" aria-label={text("账户入口", "Account actions")}>
              <button className={mode === "login" ? "is-active" : ""} type="button" onClick={() => setMode("login")}>{text("登录", "Log In")}</button>
              <button className={mode === "register" ? "is-active" : ""} type="button" onClick={() => setMode("register")}>{text("注册", "Register")}</button>
            </div>
            <div className="account-auth-copy">
              <h3>{mode === "login" ? text("选择一种方式登录", "Choose a login method") : text("选择一种方式验证并注册", "Choose a method to verify and register")}</h3>
              <p>{text("正式接入后，系统会把第三方身份绑定到你的 Oufan 账户，用于订单、钱包和客服记录。", "After production integration, the system will bind the third-party identity to your Oufan account for orders, wallet, and support history.")}</p>
            </div>
            <div className="account-provider-grid">
              {authProviders.map((provider) => (
                <button className={"account-provider " + provider.className} type="button" key={provider.key} onClick={() => startProviderAuth(provider)}>
                  <span>{provider.badge}</span>
                  <strong>{provider.name}</strong>
                  <small>{providerCopy[provider.key][isEnglish ? "en" : "zh"]}</small>
                </button>
              ))}
            </div>
            {notice ? <div className="account-notice">{notice}</div> : null}
          </div>
        )}
      </div>
    </div>
  );
}

function SupportChatPanel({ open, initialChannel = "whatsapp", onClose, language }) {
  const [session, setSession] = useState(null);
  const [activeChannel, setActiveChannel] = useState(initialChannel);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [notice, setNotice] = useState("");
  const isEnglish = language === "en";
  const text = (zh, en) => (isEnglish ? en : zh);

  const channels = [
    { key: "whatsapp", name: "WhatsApp", shortName: "WA", badgeClass: "support-badge-whatsapp", loginText: text("请先登录并绑定 WhatsApp 手机号，再使用 WhatsApp 客服。", "Log in and bind your WhatsApp phone number before using WhatsApp support."), configLabel: "WHATSAPP_BUSINESS_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN", authPath: "/api/auth/whatsapp" },
    { key: "messenger", name: "Messenger", shortName: "MS", badgeClass: "support-badge-messenger", loginText: text("请先登录 Messenger / Facebook 账号，再使用 Messenger 客服。", "Log in with Messenger / Facebook before using Messenger support."), configLabel: "FACEBOOK_PAGE_ID / MESSENGER_PAGE_ACCESS_TOKEN", authPath: "/api/auth/messenger" },
    { key: "facebook", name: "Facebook", shortName: "FB", badgeClass: "support-badge-facebook", loginText: text("请先通过 Facebook Login 绑定账号，再进入 Facebook 客服。", "Bind your account with Facebook Login before entering Facebook support."), configLabel: "META_APP_ID / META_APP_SECRET", authPath: "/api/auth/facebook" },
    { key: "email", name: text("邮件客服", "Email Support"), shortName: "@", badgeClass: "support-badge-email", loginText: text("邮件客服无需第三方登录，可直接发送邮件。", "Email support does not require third-party login."), configLabel: "SMTP / support mailbox", authPath: "mailto:hello@lppbeach.com" }
  ];

  useEffect(() => {
    if (!open) return;
    const nextSession = readAccountSession();
    setSession(nextSession);
    fetch("/api/account/session")
      .then((response) => response.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
          window.localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(data.session));
        }
      })
      .catch(() => {});
    setActiveChannel(initialChannel);
    setNotice("");
    try {
      const savedHistory = JSON.parse(window.localStorage.getItem(CHAT_HISTORY_KEY + "_" + initialChannel) || "[]");
      setHistory(Array.isArray(savedHistory) ? savedHistory : []);
    } catch {
      setHistory([]);
    }
  }, [open, initialChannel]);

  const active = channels.find((channel) => channel.key === activeChannel) || channels[0];
  const boundProviders = session?.boundProviders || [];
  const canChat = active.key === "email" || (session && boundProviders.includes(active.key));

  function requestChannelLogin() {
    if (active.key === "email") {
      window.location.href = active.authPath;
      return;
    }
    setNotice(text("正在进入 " + active.name + " 授权/客服入口...", "Opening " + active.name + " authorization/support entry..."));
    window.location.href = active.authPath;
  }

  function sendMessage(event) {
    event.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage || !canChat) return;
    const now = new Date();
    const time = now.toLocaleTimeString(isEnglish ? "en-US" : "zh-CN", { hour: "2-digit", minute: "2-digit" });
    const nextHistory = [
      ...history,
      { id: String(now.getTime()), channel: active.key, text: cleanMessage, time },
      { id: String(now.getTime()) + "-reply", channel: "support", text: text("这是 " + active.name + " 独立客服窗口。真实接入后消息会进入对应平台的客服收件箱。", "This is the dedicated " + active.name + " support window. After production integration, messages will go to that platform's support inbox."), time }
    ];
    setHistory(nextHistory);
    window.localStorage.setItem(CHAT_HISTORY_KEY + "_" + active.key, JSON.stringify(nextHistory));
    setMessage("");
  }

  if (!open) return null;

  return (
    <div className="support-overlay" role="dialog" aria-modal="true" aria-labelledby="support-panel-title">
      <div className="support-panel channel-panel">
        <button className="support-close" type="button" onClick={onClose} aria-label={text("关闭客服窗口", "Close support window")}>×</button>
        <div className="support-intro channel-intro">
          <p className="eyebrow">{text("独立客服通道", "Dedicated Support Channel")}</p>
          <h2 id="support-panel-title">{active.name}</h2>
          <p>{active.loginText}</p>
        </div>
        <div className="channel-layout">
          <aside className="channel-switcher" aria-label={text("切换客服渠道", "Switch support channel")}>
            {channels.map((channel) => (
              <button className={activeChannel === channel.key ? "is-active" : ""} type="button" key={channel.key} onClick={() => {
                setActiveChannel(channel.key);
                setNotice("");
                try {
                  const savedHistory = JSON.parse(window.localStorage.getItem(CHAT_HISTORY_KEY + "_" + channel.key) || "[]");
                  setHistory(Array.isArray(savedHistory) ? savedHistory : []);
                } catch {
                  setHistory([]);
                }
              }}>
                <span className={"support-badge " + channel.badgeClass}>{channel.shortName}</span>
                <strong>{channel.name}</strong>
              </button>
            ))}
          </aside>
          <section className="support-chat channel-chat">
            <div className="support-chat-head">
              <span className={"support-badge " + active.badgeClass}>{active.shortName}</span>
              <div>
                <strong>{active.name}</strong>
                <small>{canChat ? text("已满足当前通道聊天条件", "This channel is ready for chat.") : active.loginText}</small>
              </div>
            </div>
            {!canChat ? (
              <div className="channel-login-gate">
                <span className={"support-badge " + active.badgeClass}>{active.shortName}</span>
                <h3>{text("需要先登录/绑定", "Login or binding required")}</h3>
                <p>{active.loginText}</p>
                <button type="button" onClick={requestChannelLogin}>{text("登录 " + active.name, "Log in with " + active.name)}</button>
                {notice ? <small>{notice}</small> : null}
              </div>
            ) : (
              <>
                <div className="support-chat-body" aria-live="polite">
                  {history.length ? history.map((item) => (
                    <div className={"support-message" + (item.channel === "support" ? " is-support" : "")} key={item.id}>
                      <p>{item.text}</p>
                      <span>{item.channel === "support" ? "Oufan" : active.name} · {item.time}</span>
                    </div>
                  )) : <div className="support-empty">{text("这是 " + active.name + " 的独立聊天窗口。", "This is the dedicated " + active.name + " chat window.")}</div>}
                </div>
                <form className="support-chat-form" onSubmit={sendMessage}>
                  <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={text("输入要发送给客服的消息", "Type a message to support")} />
                  <button type="submit">{text("发送", "Send")}</button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a className="footer-showcase-brand" href="/" aria-label="Oufan 草帽品牌展示站">
          <img src="/assets/oufan-logo.jpg" alt="Oufan 草帽品牌标志" />
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
  const [catalog, setCatalog] = useState(products);

  useEffect(() => setSearch(initialSearch), [initialSearch]);
  useEffect(() => setFilter(initialFilter), [initialFilter]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get("filter");
    const urlSearch = params.get("keywords");

    if (urlFilter) setFilter(urlFilter);
    if (urlSearch) setSearch(urlSearch);
  }, []);
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

  const visibleProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const items = catalog.filter((product) => {
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
  }, [catalog, filter, limit, search, sort]);

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
  const detailHref = product.adminManaged ? `/shop?keywords=${encodeURIComponent(product.title)}` : productPath(product);

  useEffect(() => {
    setWished(readJson(STORAGE_KEYS.wishlist, []).includes(product.slug));
    setCompared(readJson(STORAGE_KEYS.compare, []).includes(product.slug));
  }, [product.slug]);

  function handleAddToCart() {
    window.location.href = `/cart?product=${product.slug}`;
  }

  return (
    <article className="product-card">
      <a className="product-media" href={detailHref} aria-label={`查看${product.title}`}>
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

export function StorageCollectionView({ type, initialProductSlug, initialQuantity }) {
  const initialized = useRef(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const key = STORAGE_KEYS[type];
    const params = new URLSearchParams(window.location.search);
    const productSlug = initialProductSlug || params.get("product") || "";
    const quantity = Number(initialQuantity) || Number(params.get("qty")) || 1;

    if (type === "cart" && productSlug && !initialized.current) {
      initialized.current = true;
      addToCart(productSlug, quantity);
    }

    const sync = () => {
      const catalog = getClientProducts({ includeInactive: true });
      if (type === "cart") {
        const cart = readJson(key, {});
        setItems(
          Object.values(cart)
            .map((entry) => ({ product: catalog.find((item) => item.slug === entry.slug), qty: entry.qty }))
            .filter((entry) => entry.product)
        );
      } else {
        const slugs = readJson(key, []);
        setItems(slugs.map((slug) => catalog.find((item) => item.slug === slug)).filter(Boolean));
      }
    };

    sync();
    window.addEventListener("lpp-admin-products-change", sync);
    window.addEventListener("lpp-store-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lpp-admin-products-change", sync);
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
