import {
  CategoryShowcase,
  FaqSection,
  Footer,
  Header,
  HeroSlider,
  NewsletterCta,
  ProductGrid,
  ReviewsMarquee,
  ServicePromises
} from "./components";
import { heroSlides } from "./data";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider slides={heroSlides} />
        <ServicePromises />
        <CategoryShowcase />

        <section className="shop-section">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">精选商品</p>
              <h2>热卖草帽</h2>
              <p>从海滩到户外工作，挑一顶能遮阳、能出片、也能定制 Logo 的草帽。</p>
            </div>
            <a className="button button-ghost" href="/shop">
              查看全部商品
            </a>
          </div>
          <ProductGrid limit={8} showTools={false} />
        </section>

        <ReviewsMarquee />
        <FaqSection />
        <NewsletterCta />
      </main>
      <Footer />
    </>
  );
}
