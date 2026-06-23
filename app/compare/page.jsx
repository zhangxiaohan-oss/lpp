import { Footer, Header, StorageCollectionView } from "../components";

export const metadata = {
  title: "商品对比 | LPP 草帽店"
};

export default function ComparePage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <p className="eyebrow">商品对比</p>
          <h1>对比草帽款式</h1>
          <p>你加入对比的商品会显示在这里，方便比较价格、标签、场景和详情。</p>
        </section>
        <section className="shop-section">
          <StorageCollectionView type="compare" />
        </section>
      </main>
      <Footer />
    </>
  );
}
