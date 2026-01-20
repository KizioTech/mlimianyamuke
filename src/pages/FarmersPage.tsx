import { FarmersSection } from "@/components/FarmersSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import PriceHistory from "@/components/PriceHistory";
import { useLanguage } from "@/contexts/LanguageContext";

const FarmersPage = () => {
  const { language } = useLanguage();

  return (
    <div className="pt-20">
      <FarmersSection language={language} />
      <div className="container mx-auto px-4 py-10">
        <PriceHistory />
      </div>
      <TestimonialsSection language={language} />
      <FAQSection language={language} />
      <CTASection language={language} />
    </div>
  );
};

export default FarmersPage;
