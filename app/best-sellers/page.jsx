import { Footer, Header, ProductCard, ReviewsMarquee, ServicePromises } from "../components";
import { products } from "../data";

export const metadata = {
  title: "Best Sellers | LPP Hat Shop"
};

export default function BestSellersPage() {
  const bestSellers = products
    .slice()
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 8);

  return (
    <>
      <Header />
      <main>
        <section className="page-hero shop-hero">
          <p className="eyebrow">Customer favorites</p>
          <h1>Best sellers</h1>
          <p>从评分、评价数和批发适配度中筛出的热卖草帽，适合快速挑选展示和采购款。</p>
        </section>
        <ServicePromises />
        <section className="shop-section">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Top rated</p>
              <h2>热卖精选</h2>
              <p>把更容易成交、展示感更强的款式放在这一页，便于临时演示给客户看。</p>
            </div>
            <a className="button button-ghost" href="/shop?filter=wholesale">
              Bulk order picks
            </a>
          </div>
          <div className="product-grid">
            {bestSellers.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>
        <ReviewsMarquee />
      </main>
      <Footer />
    </>
  );
}
