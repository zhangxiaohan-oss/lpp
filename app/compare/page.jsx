import { Footer, Header } from "../components";

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
          <p>当前静态版本保留商品对比入口，后续可加入多商品参数对比表。</p>
          <a className="button button-primary" href="/shop">
            返回商店
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
