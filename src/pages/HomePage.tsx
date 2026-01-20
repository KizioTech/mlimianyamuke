import { useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PartnersSection } from "@/components/PartnersSection";
import { CTASection } from "@/components/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";
import { analytics } from "@/utils/analytics";

const HomePage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    analytics.page('HomePage');
  }, []);

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
