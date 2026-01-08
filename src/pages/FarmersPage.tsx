import { FarmersSection } from "@/components/FarmersSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";

const FarmersPage = () => {
  const { language } = useLanguage();

  return (
    <div className="pt-20">
      <FarmersSection language={language} />
      <TestimonialsSection language={language} />
      <FAQSection language={language} />
      <CTASection language={language} />
    </div>
  );
};

export default FarmersPage;
