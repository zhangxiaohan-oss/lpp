import { Footer, Header } from "../components";
import CheckoutClient from "./checkout-client";

export const metadata = {
  title: "结账 | LPP 草帽店"
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main>
        <CheckoutClient />
      </main>
      <Footer />
    </>
  );

}