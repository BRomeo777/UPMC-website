import { HeroSection } from "../components/HeroSection";
import { ServicesBlock } from "../components/ServicesBlock";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { LocationSection } from "../components/LocationSection";
import { PartnerCarousel } from "../components/PartnerCarousel";

export function HomePage() {
  return (
    <div style={{ background: "#f8fafc" }}>
      <HeroSection />

      <ServicesBlock />

      <TestimonialsSection />
      
      <LocationSection />

      <PartnerCarousel />
    </div>
  );
}