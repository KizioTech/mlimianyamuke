import { AboutSection } from "@/components/AboutSection";
import { TeamSection } from "@/components/TeamSection";
import { PartnersSection } from "@/components/PartnersSection";
import { CTASection } from "@/components/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutPage = () => {
  const { language } = useLanguage();

  return (
    <div className="pt-20">
      <AboutSection language={language} />
      <TeamSection language={language} />
      <PartnersSection language={language} />
      <CTASection language={language} />
    </div>
  );
};

export default AboutPage;
