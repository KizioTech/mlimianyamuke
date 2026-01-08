import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, Users, Award } from "lucide-react";

interface AboutSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    badge: "About Us",
    title: "Empowering Malawi's",
    titleHighlight: "Agricultural Future",
    subtitle: "Mlimi Anyamuke Initiative bridges the gap between traditional farming wisdom and modern agricultural science, delivering accessible, localized solutions that help farmers thrive.",
    mission: {
      title: "Our Mission",
      description: "To be Malawi's most trusted digital agricultural advisory platform, empowering farmers with knowledge and tools for sustainable prosperity.",
    },
    values: [
      {
        icon: Target,
        title: "Farmer-First",
        description: "Every feature we build starts with understanding farmer needs and constraints.",
      },
      {
        icon: TrendingUp,
        title: "Evidence-Based",
        description: "Our recommendations are backed by agricultural research and local field data.",
      },
      {
        icon: Users,
        title: "Community-Driven",
        description: "We work alongside farming communities, NGOs, and government partners.",
      },
      {
        icon: Award,
        title: "Quality Assured",
        description: "Our consultants are certified professionals with proven track records.",
      },
    ],
  },
  ny: {
    badge: "Za Ife",
    title: "Kulimbikitsa Tsogolo",
    titleHighlight: "Laulimi la Malawi",
    subtitle: "Mlimi Anyamuke Initiative ikugwirizanitsa nzeru zaulimi zakale ndi sayansi yaulimi yamakono, kupereka mayankho osavuta, apadziko pano omwe amathandiza alimi kupambana.",
    mission: {
      title: "Cholinga Chathu",
      description: "Kukhala malo ophunzirira za ulimi owatsimikizira ku Malawi, kulimbikitsa alimi ndi chidziwitso ndi zipangizo zokhazikika bwino.",
    },
    values: [
      {
        icon: Target,
        title: "Mlimi Poyamba",
        description: "Chilichonse chomwe timapanga chiyambira pomvetsetsa zosowa za alimi.",
      },
      {
        icon: TrendingUp,
        title: "Zochokera ku Umboni",
        description: "Malangizo athu amatsimikiziridwa ndi kafukufuku waulimi ndi deta yapadziko pano.",
      },
      {
        icon: Users,
        title: "Kutsogoledwa ndi Anthu",
        description: "Timagwira ntchito limodzi ndi alimi, mabungwe, ndi boma.",
      },
      {
        icon: Award,
        title: "Watsimikiziridwa Bwino",
        description: "Aphunzitsi athu ndi akatswiri ovomerezeka okhala ndi mbiri yabwino.",
      },
    ],
  },
};

export function AboutSection({ language }: AboutSectionProps) {
  const t = translations[language];

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Mission */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">{t.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="text-foreground">{t.title}</span>
              <br />
              <span className="text-primary">{t.titleHighlight}</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {t.subtitle}
            </p>

            {/* Mission Card */}
            <Card variant="gradient" className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-foreground mb-3">{t.mission.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.mission.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Values */}
          <div className="grid sm:grid-cols-2 gap-6">
            {t.values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index} 
                  variant="feature" 
                  className="group"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
