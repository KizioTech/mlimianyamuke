import { Users, MapPin, Leaf, Award } from "lucide-react";

interface StatsSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    title: "Trusted Across Malawi",
    stats: [
      { value: "10,000+", label: "Active Farmers", icon: Users },
      { value: "28", label: "Districts Covered", icon: MapPin },
      { value: "50+", label: "Expert Consultants", icon: Award },
      { value: "25+", label: "Crop Varieties", icon: Leaf },
    ],
  },
  ny: {
    title: "Wothemba ku Malawi Konse",
    stats: [
      { value: "10,000+", label: "Alimi Ogwira Ntchito", icon: Users },
      { value: "28", label: "Maboma Omwe Timagwira", icon: MapPin },
      { value: "50+", label: "Aphunzitsi Odziwa", icon: Award },
      { value: "25+", label: "Mitundu ya Mbeu", icon: Leaf },
    ],
  },
};

export function StatsSection({ language }: StatsSectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground text-center mb-12">
          {t.title}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {t.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/70 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
