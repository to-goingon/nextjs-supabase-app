import { SimplifiedHeroSection } from "@/components/landing/simplified-hero-section";
import { FeaturesSection } from "@/components/landing/features-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <SimplifiedHeroSection />
      <FeaturesSection />
    </main>
  );
}
