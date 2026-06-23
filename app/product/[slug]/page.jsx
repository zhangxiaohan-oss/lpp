import { notFound } from "next/navigation";
import { Footer, Header, TagRow } from "../../components";
import { Price } from "../../currency";
import { findProduct, products } from "../../data";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }) {
  const product = findProduct(params.slug);
  return {
    title: product ? `${product.title} | LPP 草帽店` : "商品详情 | LPP 草帽店"
  };
}

export default function ProductDetailPage({ params }) {
  const product = findProduct(params.slug);
  if (!product) notFound();

  return (
    <>
      <Header />
      <main>
        <section className="product-detail">
          <div className="product-detail-media">
            <img src={product.image} alt={`${product.title} 商品图`} />
          </div>
          <div className="product-detail-copy">
            <p className="eyebrow">商品详情</p>
            <h1>{product.title}</h1>
            <div className="price product-detail-price">
              <Price price={product.price} priceLabel={product.priceLabel} />
            </div>
            <p>{product.description}</p>
            <TagRow tags={product.tags} />
            <div className="detail-actions">
              <a className="button button-primary" href={`/cart?product=${product.slug}`}>
                加入购物车
              </a>
              <a className="button button-ghost" href={`/checkout?product=${product.slug}`}>
                立即购买
              </a>
              <a className="button button-ghost" href={product.source} target="_blank" rel="noreferrer">
                查看源商品页
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
