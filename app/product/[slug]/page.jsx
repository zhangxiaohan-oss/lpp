import { notFound } from "next/navigation";
import { Footer, Header, ProductDetailView } from "../../components";
import { findProduct, products } from "../../data";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = findProduct(slug);
  return {
    title: product ? `${product.title} | LPP 草帽店` : "商品详情 | LPP 草帽店"
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const relatedProducts = products
    .filter((item) => item.slug !== product.slug && item.tags.some((tag) => product.tags.includes(tag)))
    .slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
