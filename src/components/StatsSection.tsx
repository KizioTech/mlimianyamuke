import { Users, MapPin, Leaf, Award } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [stats, setStats] = useState({
    farmers: "10,000+",
    districts: "28", // We don't track districts in DB yet, keep static
    consultants: "50+", // Keep static
    crops: "25+"
  });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.farmers === 'number') {
          // Format numbers if needed, e.g. 1000 -> 1k+ if desirable, or just show raw
          setStats(prev => ({
            ...prev,
            farmers: data.farmers > 10000 ? "10,000+" : data.farmers.toString(),
            crops: data.crops > 0 ? data.crops.toString() + "+" : prev.crops,
            // We can also use 'impact' for consultants or districts if we want to change mapping
          }));
        }
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  const dynamicStats = [
    { value: stats.farmers, label: t.stats[0].label, icon: Users },
    { value: stats.districts, label: t.stats[1].label, icon: MapPin },
    { value: stats.consultants, label: t.stats[2].label, icon: Award },
    { value: stats.crops, label: t.stats[3].label, icon: Leaf },
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground text-center mb-12">
          {t.title}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {dynamicStats.map((stat, index) => {
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
