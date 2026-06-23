import { Footer, Header, StorageCollectionView } from "../components";

export const metadata = {
  title: "收藏夹 | LPP 草帽店"
};

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <p className="eyebrow">收藏夹</p>
          <h1>收藏你喜欢的草帽</h1>
          <p>你在商品卡或详情页点过的收藏会显示在这里，方便临时展示选品流程。</p>
        </section>
        <section className="shop-section">
          <StorageCollectionView type="wishlist" />
        </section>
      </main>
      <Footer />
    </>
  );
}
