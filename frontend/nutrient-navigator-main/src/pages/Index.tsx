import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NutrientSelector from "@/components/NutrientSelector";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <NutrientSelector />
      <HowItWorks />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
