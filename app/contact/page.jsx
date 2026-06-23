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
          <div className="section-heading">
            <h1>联系我们</h1>
            <p>需要批发、定制或售后支持时，可以通过以下方式联系。</p>
          </div>
          <div className="contact-grid">
            <article>
              <h3>地址</h3>
              <p>
                1901 Thornridge Cir.
                <br />
                Shiloh, Hawaii 81063
              </p>
            </article>
            <article>
              <h3>营业时间</h3>
              <p>
                周一至周二：上午 10:00 - 下午 4:00，需预约
                <br />
                周三至周六：上午 10:00 - 下午 4:00
                <br />
                周日：休息
              </p>
            </article>
            <article>
              <h3>电话 / 邮箱</h3>
              <p>
                (956) 238-7908
                <br />
                mail@mail.com
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
