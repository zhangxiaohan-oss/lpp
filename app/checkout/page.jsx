import { Footer, Header } from "../components";
import { findProduct } from "../data";
import CheckoutClient from "./checkout-client";

export const metadata = {
  title: "结账 | LPP 草帽店"
};

export default async function CheckoutPage({ searchParams }) {
  const query = await searchParams;
  const productSlug = typeof query?.product === "string" ? query.product : "";
  const product = productSlug ? findProduct(productSlug) : null;
  const quantity = typeof query?.qty === "string" ? Number(query.qty) || 1 : 1;

  return (
    <>
      <Header />
      <main>
        <CheckoutClient initialProduct={product} productSlug={productSlug} quantity={quantity} />
      </main>
      <Footer />
    </>
  );

}

