interface PartnersSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    title: "Trusted by Leading Organizations",
    partners: [
      "Ministry of Agriculture",
      "FAO Malawi",
      "USAID Feed the Future",
      "World Bank",
      "NASFAM",
      "Farmers Union of Malawi",
    ],
  },
  ny: {
    title: "Wothemba ndi Mabungwe Akuluakulu",
    partners: [
      "Unduna wa Ulimi",
      "FAO Malawi",
      "USAID Feed the Future",
      "World Bank",
      "NASFAM",
      "Farmers Union of Malawi",
    ],
  },
};

export function PartnersSection({ language }: PartnersSectionProps) {
  const t = translations[language];

  return (
    <section className="py-12 bg-secondary/50 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-muted-foreground text-sm mb-8">{t.title}</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {t.partners.map((partner, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-background rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-primary hover:border-primary/30 transition-colors"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
