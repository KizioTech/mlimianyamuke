import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PartnersSection } from "@/components/PartnersSection";
import { CTASection } from "@/components/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";

const HomePage = () => {
  const { language } = useLanguage();

  return (
    <>
      <HeroSection language={language} />
      <PartnersSection language={language} />
      <StatsSection language={language} />
      <ServicesSection language={language} />
      <TestimonialsSection language={language} />
      <CTASection language={language} />
    </>
  );
};

export default HomePage;
