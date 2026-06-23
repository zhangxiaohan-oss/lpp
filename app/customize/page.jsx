import { Footer, Header } from "../components";

export const metadata = {
  title: "定制服务 | LPP 草帽店"
};

export default function CustomizePage() {
  return (
    <>
      <Header />
      <main>
        <section className="custom-section page-section">
          <div>
            <p className="eyebrow">定制服务</p>
            <h1>定制 Logo 草帽</h1>
            <p>
              选择颜色和尺码后，将你的需求提交给客服即可。批发定制价格按数量分级，运费会根据订单单独报价。
            </p>
            <a className="button button-primary" href="/checkout?product=customize">
              提交定制需求
            </a>
          </div>
          <div className="pricing-ladder">
            <article>
              <span>50-200 件</span>
              <strong>$6.19</strong>
            </article>
            <article>
              <span>200-500 件</span>
              <strong>$4.50</strong>
            </article>
            <article>
              <span>500 件以上</span>
              <strong>$3.50</strong>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
