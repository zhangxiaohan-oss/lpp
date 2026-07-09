import { CategoryShowcase, FaqSection, Footer, Header, ProductGrid, ServicePromises } from "../components";

export const metadata = {
  title: "商店 | LPP 草帽店"
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero shop-hero">
          <p className="eyebrow">全部商品</p>
          <h1>草帽商店</h1>
          <p>浏览所有草帽、救生员帽、海滩帽和批发定制款式。可搜索关键词、按场景筛选并查看人民币价格。</p>
        </section>
        <ServicePromises />
        <CategoryShowcase />
        <section className="shop-section">
          <ProductGrid />
        </section>
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}