import { ServicesSection } from "@/components/ServicesSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesPage = () => {
  const { language } = useLanguage();

  return (
    <div className="pt-20">
      <ServicesSection language={language} />
      <FAQSection language={language} />
      <CTASection language={language} />
    </div>
  );
};

export default ServicesPage;
