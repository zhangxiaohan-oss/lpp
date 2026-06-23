import { Footer, Header, ProductGrid } from "../components";

export const metadata = {
  title: "商店 | LPP 草帽店"
};

export default async function ShopPage({ searchParams }) {
  const query = await searchParams;
  const initialFilter = typeof query?.filter === "string" ? query.filter : "all";

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <p className="eyebrow">全部商品</p>
          <h1>草帽商店</h1>
          <p>浏览所有草帽、救生员帽、海滩帽和批发定制款式。</p>
        </section>
        <section className="shop-section">
          <ProductGrid initialFilter={initialFilter} />
        </section>
      </main>
      <Footer />
    </>
  );
}
