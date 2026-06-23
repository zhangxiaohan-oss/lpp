import { Footer, Header } from "../components";
import { Price } from "../currency";
import { findProduct } from "../data";

export const metadata = {
  title: "结账 | LPP 草帽店"
};

export default async function CheckoutPage({ searchParams }) {
  const query = await searchParams;
  const product = query?.product ? findProduct(query.product) : null;
  const quantity = typeof query?.qty === "string" ? Number(query.qty) || 1 : 1;

  return (
    <>
      <Header />
      <main>
        <section className="checkout-page">
          <div>
            <p className="eyebrow">结账</p>
            <h1>填写购买信息</h1>
            <p>当前页面为静态购买流程演示，可作为后续真实支付、地址和库存系统的入口。</p>
            {product ? (
              <article className="checkout-product">
                <img src={product.image} alt={`${product.title} 商品图`} />
                <div>
                  <h2>{product.title}</h2>
                  <div className="price">
                    <Price price={product.price} priceLabel={product.priceLabel} compact />
                  </div>
                  <span>数量：{quantity}</span>
                </div>
              </article>
            ) : (
              <div className="panel-empty">尚未选择商品。你可以先去商店选择一款草帽。</div>
            )}
          </div>
          <form className="checkout-form">
            <label>
              姓名
              <input type="text" placeholder="请输入收货人姓名" />
            </label>
            <label>
              邮箱
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              电话
              <input type="tel" placeholder="请输入联系电话" />
            </label>
            <label>
              收货地址
              <input type="text" placeholder="请输入收货地址" />
            </label>
            <label>
              备注
              <textarea placeholder="定制 Logo、尺码、数量或其他需求" />
            </label>
            <button className="button button-primary" type="button">
              提交订单
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
