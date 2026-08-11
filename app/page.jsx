import {
  CategoryShowcase,
  FaqSection,
  Footer,
  Header,
  HeroSlider,
  NewsletterCta,
  ReviewsMarquee,
  ServicePromises,
  FeaturedProductsSection
} from "./components";
import { heroSlides } from "./data";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider slides={heroSlides} />
        <ServicePromises />
        <CategoryShowcase />

        <FeaturedProductsSection />

        <ReviewsMarquee />
        <FaqSection />
        <NewsletterCta />
      </main>
      <Footer />
    </>
  );
}
