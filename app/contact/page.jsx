import { Footer, Header } from "../components";

export const metadata = {
  title: "联系我们 | LPP 草帽店"
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="contact-section page-section">
          <div>
            <p className="eyebrow">联系我们</p>
            <h1>告诉我们你的草帽需求</h1>
            <p>无论是样品、批发、Logo 定制还是展示合作，都可以先用这个前端表单整理需求。</p>
            <a className="button button-ghost" href="/shop">
              先浏览商品
            </a>
          </div>
          <form className="contact-form">
            <label>
              姓名
              <input type="text" placeholder="请输入姓名" />
            </label>
            <label>
              邮箱
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              需求类型
              <input type="text" placeholder="批发 / Logo 定制 / 样品 / 其他" />
            </label>
            <label>
              需求说明
              <textarea placeholder="数量、交期、Logo 方式、目标场景等" />
            </label>
            <button className="button button-primary" type="button">
              发送需求
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
