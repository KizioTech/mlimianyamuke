import { ContactSection } from "@/components/ContactSection";
import { FAQSection } from "@/components/FAQSection";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactPage = () => {
  const { language } = useLanguage();

  return (
    <div className="pt-20">
      <ContactSection language={language} />
      <FAQSection language={language} />
    </div>
  );
};

export default ContactPage;
