import { Footer, Header } from "../components";
import { Price } from "../currency";
import { findProduct } from "../data";

export const metadata = {
  title: "购物车 | LPP 草帽店"
};

export default async function CartPage({ searchParams }) {
  const query = await searchParams;
  const product = query?.product ? findProduct(query.product) : null;

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <p className="eyebrow">购物车</p>
          <h1>确认你的商品</h1>
          <p>这是当前静态站的购买演示页，后续可接入真实库存、账户和支付系统。</p>
        </section>
        <section className="cart-page">
          {product ? (
            <article className="cart-summary">
              <img src={product.image} alt={`${product.title} 商品图`} />
              <div>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <div className="price">
                  <Price price={product.price} priceLabel={product.priceLabel} />
                </div>
              </div>
              <a className="button button-primary" href={`/checkout?product=${product.slug}`}>
                去结算
              </a>
            </article>
          ) : (
            <div className="panel-empty">
              购物车暂无商品。请先前往 <a href="/shop">商店</a> 选择商品。
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
