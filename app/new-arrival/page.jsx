import { Footer, Header, ProductCard, ServicePromises } from "../components";
import { products } from "../data";

export const metadata = {
  title: "New Arrival | LPP Hat Shop"
};

export default function NewArrivalPage() {
  const newProducts = products.slice(0, 8);

  return (
    <>
      <Header />
      <main>
        <section className="page-hero shop-hero">
          <p className="eyebrow">Fresh beach-ready styles</p>
          <h1>New Arrival</h1>
          <p>
            最新上架的草编帽、救生员帽和 Logo 定制款，适合海边活动、户外团队和夏季品牌周边展示。
          </p>
        </section>
        <ServicePromises />
        <section className="shop-section">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Latest picks</p>
              <h2>新款推荐</h2>
              <p>优先展示近期主推款式，保持与首页海边草帽品牌风格一致。</p>
            </div>
            <a className="button button-ghost" href="/shop">
              View all products
            </a>
          </div>
          <div className="product-grid">
            {newProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
