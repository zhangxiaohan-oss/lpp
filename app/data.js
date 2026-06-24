export const navItems = [
  { label: "首页", href: "/" },
  { label: "商店", href: "/shop" },
  { label: "关于我们", href: "/about" },
  { label: "定制服务", href: "/customize" },
  { label: "订单追踪", href: "/tracking" },
  { label: "联系我们", href: "/contact" }
];

export const categories = [
  {
    label: "海滩草帽",
    filter: "beach",
    image: "/assets/category-02.jpg",
    description: "轻便透气，适合旅行、度假和日常防晒。"
  },
  {
    label: "救生员帽",
    filter: "lifeguard",
    image: "/assets/category-03.jpg",
    description: "宽檐遮阳，户外工作和冲浪场景都稳。"
  },
  {
    label: "冲浪系列",
    filter: "surf",
    image: "/assets/category-01.jpg",
    description: "美式海岸气质，适合团队和活动采购。"
  },
  {
    label: "Logo 定制",
    filter: "custom",
    image: "/assets/category-04.jpg",
    description: "贴章、印花、帽绳和批量方案可沟通。"
  }
];

export const heroSlides = [
  {
    eyebrow: "天然草编帽",
    title: "戴上我们的草帽，保持清爽与有型",
    description: "为海滩、冲浪、钓鱼、园艺和户外工作设计的宽檐草帽，兼顾防晒、透气和品牌展示。",
    image: "/assets/source-banner-model-generated.png",
    cta: "立即选购",
    href: "/shop"
  },
  {
    eyebrow: "批发与定制",
    title: "让你的 Logo 出现在夏天最显眼的位置",
    description: "支持贴章、印花、帽底图案和团队采购，适合冲浪店、度假村、活动周边与户外团队。",
    image: "/assets/source-banner-custom-generated.png",
    cta: "咨询定制",
    href: "/customize"
  }
];

export const servicePromises = [
  {
    kicker: "Fast shipping",
    title: "满 $30 免费配送",
    description: "常规商品支持快速发货，批量订单可单独确认运输方案。"
  },
  {
    kicker: "Natural weave",
    title: "天然材料优先",
    description: "草编纹理、宽檐结构和透气帽身，适合长时间户外佩戴。"
  },
  {
    kicker: "Custom ready",
    title: "支持定制订单",
    description: "Logo 贴章、颜色、帽绳、包装和数量需求都可以前端提交询价。"
  }
];

const baseProducts = [
  {
    id: 29327,
    slug: "customize",
    title: "定制草帽",
    price: null,
    priceLabel: "定制报价",
    image: "/assets/product-01.jpg",
    source: "https://lpphatshop.com/product/customize/",
    tags: ["custom", "wholesale", "straw hat"],
    description:
      "可选择颜色和尺码，并将订单需求提交给客服。批发价：50-200 件每件 $6.19，200-500 件每件 $4.50，500 件以上每件 $3.50，运费另行报价。"
  },
  {
    id: 29321,
    slug: "wholesale-custom-logo-surfing-beach-straw-hats",
    title: "夏季成人冲浪海滩草帽批发定制",
    price: 30.9,
    image: "/assets/product-02.jpg",
    source:
      "https://lpphatshop.com/product/wholesale-custom-made-logo-summer-adult-surfing-beach-straw-hats-natural-hollow-straw-bulk-mens-and-womens-lifeguard-straw-hats/",
    tags: ["custom", "wholesale", "surf", "beach"],
    description: "适合批量采购的夏季草帽，支持 Logo 定制，自然镂空草编结构，男女通用。"
  },
  {
    id: 29315,
    slug: "american-style-lifeguard-straw-hats",
    title: "美式救生员冲浪草帽",
    price: 29.9,
    image: "/assets/product-03.jpg",
    source:
      "https://lpphatshop.com/product/wholesale-summer-sun-lifeguard-straw-hats-custom-logo-prints-american-style-straw-hats-surfing-lifeguard-straw-hats/",
    tags: ["custom", "lifeguard", "surf", "wholesale"],
    description: "美式救生员草帽，主打夏季遮阳、防晒和冲浪文化，可支持 Logo 印花定制。"
  },
  {
    id: 29309,
    slug: "plain-wide-brim-sun-hat",
    title: "素色宽檐户外遮阳草帽",
    price: 28.9,
    image: "/assets/product-04.jpeg",
    source: "https://lpphatshop.com/product/plain-wide-brimmed-sun-hat-for-lifeguards-farmers-and-gardeners/",
    tags: ["lifeguard", "outdoor", "beach"],
    description: "素色宽檐遮阳帽，适合救生员、农场、园艺和日常户外防晒。"
  },
  {
    id: 29303,
    slug: "natural-straw-lifeguard-logo-print-hat",
    title: "自然草编 Logo 印花救生员帽",
    price: 30.9,
    image: "/assets/product-05.jpeg",
    source:
      "https://lpphatshop.com/product/wholesale-summer-sun-lifeguard-straw-hats-custom-logo-prints-american-straw-hats-surfing-lifeguard-natural-straw-hats/",
    tags: ["custom", "lifeguard", "surf", "wholesale"],
    description: "自然草编救生员帽，采用美式宽檐造型，适合批发和 Logo 印花定制。"
  },
  {
    id: 29297,
    slug: "wide-brim-summer-fishing-straw-hat",
    title: "宽檐钓鱼冲浪草帽",
    price: 28.9,
    image: "/assets/product-06.jpeg",
    source:
      "https://lpphatshop.com/product/wholesale-wide-brimmed-summer-designer-printed-sun-beach-lifeguard-surfing-hunting-fishing-woven-straw-hats-for-men/",
    tags: ["lifeguard", "surf", "wholesale", "fishing"],
    description: "宽檐编织草帽，适合海滩、救生员、冲浪、狩猎和钓鱼等户外使用。"
  },
  {
    id: 29291,
    slug: "custom-logo-patch-lifeguard-straw-hat",
    title: "Logo 贴章救生员草帽",
    price: 28.9,
    image: "/assets/product-07.png",
    source:
      "https://lpphatshop.com/product/customized-wholesale-summer-sunshade-straw-hat-natural-straw-lifeguard-straw-hat-custom-logo-patch/",
    tags: ["custom", "lifeguard", "wholesale"],
    description: "自然草编救生员遮阳帽，支持定制 Logo 贴章，适合批发订单。"
  },
  {
    id: 29284,
    slug: "unisex-beach-lifeguard-straw-hat",
    title: "男女通用海滩救生员草帽",
    price: 30.9,
    image: "/assets/product-08.png",
    source:
      "https://lpphatshop.com/product/summer-lifeguard-sun-protection-wide-brimmed-straw-beach-hat-unisex-custom-logo-patch-print-american-style-straw-hat-for-surfing-and-beaches/",
    tags: ["custom", "lifeguard", "surf", "beach"],
    description: "男女通用宽檐海滩帽，主打防晒、美式造型和定制 Logo 贴章印花。"
  },
  {
    id: 29278,
    slug: "applique-embroidered-logo-lifeguard-hat",
    title: "刺绣 Logo 救生员草帽",
    price: 29.9,
    image: "/assets/product-09.png",
    source: "https://lpphatshop.com/product/lifeguard-straw-hat-with-applique-embroidered-logo/",
    tags: ["custom", "lifeguard"],
    description: "救生员草帽款式，支持贴布刺绣 Logo，适合夏季品牌活动和团体使用。"
  },
  {
    id: 29272,
    slug: "custom-panama-beach-lifeguard-hat",
    title: "巴拿马海滩风定制草帽",
    price: 28.9,
    image: "/assets/product-10.png",
    source:
      "https://lpphatshop.com/product/custom-summer-sun-hat-natural-grass-lifeguard-hat-custom-logo-patch-surfing-adventure-panama-beach-hat/",
    tags: ["custom", "lifeguard", "surf", "beach"],
    description: "自然草编夏季遮阳帽，适合救生员、冲浪探险、巴拿马海滩造型和 Logo 定制。"
  },
  {
    id: 29266,
    slug: "custom-printed-surfing-straw-hats",
    title: "高品质冲浪草帽批发定制",
    price: 30.9,
    image: "/assets/product-11.png",
    source:
      "https://lpphatshop.com/product/wholesale-high-quality-custom-printed-summer-surfing-straw-hats-beach-hats-surfing-lifeguard-straw-hats-with-logos/",
    tags: ["custom", "surf", "lifeguard", "wholesale"],
    description: "支持定制印花的草帽，适合夏季冲浪、海滩和救生员场景，突出品牌 Logo 展示。"
  },
  {
    id: 29260,
    slug: "fashion-custom-logo-beach-straw-hat",
    title: "时尚 Logo 海滩草帽",
    price: 29.9,
    image: "/assets/product-12.png",
    source:
      "https://lpphatshop.com/product/unisex-fashionable-custom-logo-summer-beach-straw-hat-natural-surfing-lifeguard-wide-brimmed-straw-hat/",
    tags: ["custom", "surf", "lifeguard", "beach"],
    description: "时尚男女通用海滩草帽，融合自然草编、冲浪和救生员风格。"
  },
  {
    id: 29254,
    slug: "striped-american-straw-hat",
    title: "条纹美式冲浪草帽",
    price: 28.9,
    image: "/assets/product-13.png",
    source:
      "https://lpphatshop.com/product/wholesale-custom-printed-american-straw-hats-beach-hats-wide-brimmed-striped-surfing-summer-sun-protection-lifeguard-logo-outdoor-straw-hats/",
    tags: ["custom", "surf", "lifeguard", "wholesale"],
    description: "宽檐条纹美式草帽，适合海滩、冲浪、防晒、救生员和户外 Logo 定制。"
  },
  {
    id: 29248,
    slug: "wholesale-american-beach-straw-hat",
    title: "美式海滩草帽批发",
    price: 30.9,
    image: "/assets/product-14.png",
    source: "https://lpphatshop.com/product/wholesale-summer-lifeguard-straw-hats-american-straw-hats-beach-hats/",
    tags: ["lifeguard", "beach", "wholesale"],
    description: "夏季救生员草帽批发款，采用美式海滩帽造型。"
  },
  {
    id: 29242,
    slug: "upf50-american-flag-surfing-hat",
    title: "UPF 50 美国旗冲浪草帽",
    price: 29.9,
    image: "/assets/product-15.png",
    source:
      "https://lpphatshop.com/product/cheap-fishing-mat-for-men-and-women-wide-brimmed-straw-upf-50-large-sun-beach-boy-youth-100-blue-and-black-american-flag-lifeguard-surfing-straw-hat/",
    tags: ["lifeguard", "surf", "fishing", "UPF"],
    description: "宽檐草帽，适合男女和青少年，主打 UPF 50 防晒和蓝黑美国旗冲浪风格。"
  },
  {
    id: 29188,
    slug: "mens-fishing-surfing-logo-straw-hat",
    title: "男士钓鱼冲浪 Logo 草帽",
    price: 28.9,
    image: "/assets/product-16.png",
    source:
      "https://lpphatshop.com/product/custom-logo-patch-logo-bottom-print-mens-lifeguard-fishing-surfing-lifeguard-beach-sun-hat-sun-protection-fishing-straw-hat/",
    tags: ["custom", "lifeguard", "surf", "fishing"],
    description: "男士救生员海滩遮阳草帽，适合钓鱼和冲浪，可定制贴章和帽底 Logo 印花。"
  }
];

export const products = baseProducts.map((product, index) => {
  const neighbor = baseProducts[(index + 1) % baseProducts.length];
  const secondNeighbor = baseProducts[(index + 2) % baseProducts.length];
  return {
    ...product,
    rating: [4.9, 4.8, 5, 4.7][index % 4],
    reviewCount: 18 + index * 7,
    badges: index % 5 === 0 ? ["定制热卖", "批发推荐"] : index % 3 === 0 ? ["新品"] : ["现货"],
    gallery: Array.from(new Set([product.image, neighbor.image, secondNeighbor.image]))
  };
});

export const reviews = [
  {
    name: "海边冲浪俱乐部采购",
    location: "厦门",
    rating: 5,
    text: "帽檐够宽，Logo 贴章效果很清楚。我们做活动周边，现场拍照特别出片。"
  },
  {
    name: "度假村礼品店",
    location: "三亚",
    rating: 5,
    text: "客人很喜欢这种自然草编质感，比普通遮阳帽更有度假感，补货沟通也顺。"
  },
  {
    name: "户外团队负责人",
    location: "杭州",
    rating: 4.8,
    text: "试戴一整天没有闷，帽绳很实用。批量采购前先看样，这个页面展示很直观。"
  },
  {
    name: "花园市集摊主",
    location: "成都",
    rating: 5,
    text: "宽檐防晒是真的舒服，浅色衣服也很好搭。后面准备做定制包装。"
  }
];

export const faqs = [
  {
    question: "可以定制 Logo 吗？",
    answer: "可以。常见方式包括贴章、刺绣、印花和帽底图案，适合品牌活动、冲浪店、度假村和团队采购。"
  },
  {
    question: "价格为什么有些显示定制报价？",
    answer: "定制款会受到数量、工艺、包装和运输方式影响，因此需要先提交需求再确认最终报价。"
  },
  {
    question: "页面里的人民币价格实时吗？",
    answer: "页面会优先请求实时美元兑人民币汇率；如果网络不可用，会用备用汇率继续展示，避免页面空白。"
  },
  {
    question: "这个网站可以真实下单吗？",
    answer: "当前是前端展示版本，购物车、收藏、对比和结账流程用于演示。后续可以接入真实支付、库存和账户系统。"
  }
];

export const tagLabels = {
  custom: "定制",
  wholesale: "批发",
  "straw hat": "草帽",
  surf: "冲浪",
  lifeguard: "救生员",
  outdoor: "户外",
  fishing: "钓鱼",
  beach: "海滩",
  UPF: "UPF 防晒"
};

export function productLabel(product) {
  return product.priceLabel || (product.price === null ? "定制" : `$${product.price.toFixed(2)}`);
}

export function productPath(product) {
  return `/product/${product.slug}`;
}

export function findProduct(slugOrId) {
  return products.find((product) => product.slug === slugOrId || String(product.id) === String(slugOrId));
}
