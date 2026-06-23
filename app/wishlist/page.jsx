import { Footer, Header } from "../components";

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
          <p>当前静态版本保留收藏夹入口，后续可接入账户系统保存收藏记录。</p>
          <a className="button button-primary" href="/shop">
            返回商店
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
