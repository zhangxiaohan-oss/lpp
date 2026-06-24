import { Footer, Header, NewsletterCta, ReviewsMarquee } from "../components";

export const metadata = {
  title: "Brand Story | LPP Hat Shop"
};

export default function BrandStoryPage() {
  return (
    <>
      <Header />
      <main>
        <section className="about-section brand-story-page">
          <div>
            <p className="eyebrow">BRAND STORY</p>
            <h1>为夏天、海风和团队标识而做的草帽品牌</h1>
            <p>
              LPP 聚焦海滩、冲浪、园艺、户外工作和品牌活动场景，把宽檐遮阳、天然草编质感与 Logo
              定制能力放在同一个展示体验里。
            </p>
            <p>
              这个站点用于展示商品、批发款式、定制方向和客户反馈。它不是冷冰冰的产品目录，而是让采购方快速理解“这顶帽子放到夏季活动里会是什么效果”。
            </p>
            <div className="brand-story-badges">
              <span>Beach Retail</span>
              <span>Surf Teams</span>
              <span>Logo Custom</span>
              <span>Outdoor Supply</span>
            </div>
          </div>
          <div className="about-media">
            <img src="/assets/source-banner-model-generated.png" alt="LPP beach hat model" />
          </div>
        </section>
        <ReviewsMarquee />
        <NewsletterCta />
      </main>
      <Footer />
    </>
  );
}
