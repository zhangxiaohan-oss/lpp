import { Footer, Header } from "../components";

export const metadata = {
  title: "关于我们 | LPP 草帽店"
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="about-section page-section">
          <div className="about-copy">
            <p className="eyebrow">关于 LPP</p>
            <h1>为舒适户外而生的实用草帽</h1>
            <p>
              我们的草帽和遮阳配件专为日常户外活动设计，提供必要遮挡和舒适佩戴体验。每款产品都注重耐用性与实用性。
            </p>
            <ul>
              <li>天然草编与真实编织质感</li>
              <li>宽檐造型，提升遮阳覆盖</li>
              <li>适合海滩、冲浪、钓鱼、园艺和户外工作</li>
              <li>支持批发与 Logo 定制</li>
            </ul>
          </div>
          <div className="about-media">
            <img src="/assets/product-11.png" alt="海滩草帽商品" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
