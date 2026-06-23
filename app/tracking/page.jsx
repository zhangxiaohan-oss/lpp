import { Footer, Header } from "../components";

export const metadata = {
  title: "订单追踪 | LPP 草帽店"
};

export default function TrackingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="tracking-section page-section">
          <div>
            <p className="eyebrow">订单追踪</p>
            <h1>查询你的订单</h1>
            <p>输入订单编号和账单邮箱，即可查看购买后的订单状态。当前为前端演示表单，方便展示完整购物链路。</p>
          </div>
          <form className="tracking-card">
            <label>
              订单编号
              <input type="text" placeholder="LPP-10024" />
            </label>
            <label>
              账单邮箱
              <input type="email" placeholder="you@example.com" />
            </label>
            <button className="button button-primary" type="button">
              查询订单
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
