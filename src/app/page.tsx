import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Solutions } from "@/components/sections/solutions";
import { Products } from "@/components/sections/products";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Solutions />
      <Products />
      <Testimonials />
      <CTA />
    </>
  );
}
