import { FaqSection, Footer, Header, NewsletterCta } from "../components";

export const metadata = {
  title: "定制服务 | LPP 草帽店"
};

export default function CustomizePage() {
  return (
    <>
      <Header />
      <main>
        <section className="custom-section page-section">
          <div>
            <p className="eyebrow">Logo 定制</p>
            <h1>把你的品牌放进夏天的场景里</h1>
            <p>
              适合冲浪店、度假村、户外团队、品牌活动和礼品采购。你可以提交数量、Logo 工艺、交期和包装需求，我们会按项目报价。
            </p>
            <ul>
              <li>贴章、刺绣、印花、帽底图案均可沟通</li>
              <li>支持不同帽绳、颜色、包装组合</li>
              <li>适合批发采购和活动周边展示</li>
            </ul>
            <a className="button button-primary" href="/contact">
              提交定制需求
            </a>
          </div>
          <div className="about-media">
            <img src="/assets/category-04.jpg" alt="Logo 定制草帽" />
          </div>
        </section>
        <FaqSection />
        <NewsletterCta />
      </main>
      <Footer />
    </>
  );
}
