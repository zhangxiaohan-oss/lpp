import { Footer, Header, ProductGrid } from "./components";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section id="home" className="hero">
          <div className="hero-media">
            <img src="/assets/source-banner-model-generated.png" alt="海边佩戴草帽的模特" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">天然草编帽</p>
            <h1>
              戴上我们的草帽，保持<span>清爽</span>与<span>有型</span>
            </h1>
            <p>我们坚持使用天然高品质材料，打造适合海滩、冲浪、钓鱼、园艺和户外工作的实用草帽。</p>
            <a className="button button-primary" href="/shop">
              立即选购
            </a>
          </div>
        </section>

        <section className="service-strip" aria-label="商店服务">
          <article>
            <span className="service-icon">01</span>
            <h2>满 $30 免费配送</h2>
            <p>轻松选购适合夏季出行的草帽与遮阳配件。</p>
          </article>
          <article>
            <span className="service-icon">02</span>
            <h2>天然材料优先</h2>
            <p>草编、镂空编织与宽檐设计，为户外场景提供舒适遮阳。</p>
          </article>
          <article>
            <span className="service-icon">03</span>
            <h2>支持定制订单</h2>
            <p>Logo 贴章、颜色选择和批发数量需求均可由客服协助处理。</p>
          </article>
        </section>

        <section className="category-section">
          <div className="section-heading">
            <h2>热门分类</h2>
          </div>
          <div className="category-grid">
            <a className="category-card" href="/shop">
              <img src="/assets/category-01.jpg" alt="草帽分类" />
              <span>草帽</span>
            </a>
            <a className="category-card" href="/shop?filter=beach">
              <img src="/assets/category-02.jpg" alt="海滩草帽" />
              <span>海滩帽</span>
            </a>
            <a className="category-card" href="/shop?filter=lifeguard">
              <img src="/assets/category-03.jpg" alt="救生员草帽" />
              <span>救生员帽</span>
            </a>
            <a className="category-card" href="/customize">
              <img src="/assets/category-04.jpg" alt="定制 Logo 草帽" />
              <span>定制</span>
            </a>
          </div>
        </section>

        <section className="shop-section">
          <div className="section-heading section-heading-row">
            <div>
              <h2>热卖商品</h2>
              <p>精选草帽商品，点击商品即可进入独立详情页。</p>
            </div>
            <a className="button button-ghost" href="/shop">
              查看全部商品
            </a>
          </div>
          <ProductGrid limit={8} showTools={false} />
        </section>
      </main>
      <Footer />
    </>
  );
}
