import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";

interface CTASectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    title: "Ready to Transform Your Farm?",
    subtitle: "Join thousands of Malawian farmers who are already growing smarter with Mlimi Anyamuke Initiative.",
    cta: "Get Started Today",
    secondary: "Talk to Us",
  },
  ny: {
    title: "Mwakonzeka Kusintha Munda Wanu?",
    subtitle: "Lowani pamodzi ndi alimi a ku Malawi masauzande omwe akumalima mwanzeru ndi Mlimi Anyamuke Initiative.",
    cta: "Yambani Lero",
    secondary: "Lankhulani Nafe",
  },
};

export function CTASection({ language }: CTASectionProps) {
  const t = translations[language];

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
          {t.title}
        </h2>
        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero-accent" size="xl" className="group" asChild>
            <Link to="/register">
              {t.cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="xl" asChild>
            <Link to="/contact">
              <Phone className="w-5 h-5" />
              {t.secondary}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
