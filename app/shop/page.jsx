import { CategoryShowcase, FaqSection, Footer, Header, ProductGrid, ServicePromises, ShopHero } from "../components";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "商店 | LPP 草帽店"
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <ShopHero />
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