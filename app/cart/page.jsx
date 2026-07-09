import { Footer, Header, StorageCollectionView } from "../components";

export const metadata = {
  title: "购物车 | LPP 草帽店"
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <p className="eyebrow">购物车</p>
          <h1>确认你的商品</h1>
          <p>这里是前端演示购物车，会保存你本次浏览器里加入的商品，适合展示购买流程。</p>
        </section>
        <section className="cart-page">
          <StorageCollectionView type="cart" />
        </section>
      </main>
      <Footer />
    </>
  );
}