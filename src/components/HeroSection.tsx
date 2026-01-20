import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sun, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-farm.jpg";

interface HeroSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    badge: "Trusted by 10,000+ farmers across Malawi",
    title: "Get Weather Alerts.",
    titleHighlight: "Grow More Food.",
    subtitle: "Free weather forecasts, farming tips, and expert advice via SMS and WhatsApp. Join thousands of Malawian farmers increasing their yields.",
    cta: "Register Free",
    secondary: "See How It Works",
    stat1: "Active Farmers",
    stat2: "Districts Covered",
    stat3: "Expert Consultants",
    weatherTitle: "Today's Forecast",
    weatherLocation: "Lilongwe",
    weatherTemp: "28°C",
    weatherCondition: "Partly Cloudy",
  },
  ny: {
    badge: "Alimi opitilira 10,000 ku Malawi amatithemba",
    title: "Landirani Machenjezo a Nyengo.",
    titleHighlight: "Limani Zambiri.",
    subtitle: "Zolosera za nyengo zaulere, malangizo a ulimi, ndi uphungu wa akatswiri pa SMS ndi WhatsApp. Lowani ndi alimi masauzande a ku Malawi omwe akuwonjezera zokolola zawo.",
    cta: "Lembetsani Kwaulere",
    secondary: "Onani Momwe Zimagwirira Ntchito",
    stat1: "Alimi Ogwira Ntchito",
    stat2: "Maboma Omwe Timagwira",
    stat3: "Aphunzitsi Odziwa",
    weatherTitle: "Nyengo ya Lero",
    weatherLocation: "Lilongwe",
    weatherTemp: "28°C",
    weatherCondition: "Mitambo Pang'ono",
  },
};

export function HeroSection({ language }: HeroSectionProps) {
  const t = translations[language];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Malawian farmland with lush green crops"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-primary-foreground/90 text-sm font-medium">{t.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-primary-foreground">{t.title}</span>
              <br />
              <span className="text-accent">{t.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
              {t.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero-accent" className="group" asChild>
                <Link to="/register">
                  {t.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="hero-outline" className="group" asChild>
                <Link to="/about">
                  <Play className="w-5 h-5" />
                  {t.secondary}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary-foreground">10K+</div>
                <div className="text-primary-foreground/70 text-sm">{t.stat1}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary-foreground">28</div>
                <div className="text-primary-foreground/70 text-sm">{t.stat2}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary-foreground">50+</div>
                <div className="text-primary-foreground/70 text-sm">{t.stat3}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Weather Widget */}
          <div className="hidden lg:flex justify-end animate-fade-up delay-300">
            <div className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-3xl p-6 w-80">
              <div className="flex items-center justify-between mb-4">
                <span className="text-primary-foreground/80 text-sm font-medium">{t.weatherTitle}</span>
                <span className="text-primary-foreground/60 text-xs">{t.weatherLocation}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <Sun className="w-10 h-10 text-accent" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-foreground">{t.weatherTemp}</div>
                  <div className="text-primary-foreground/70 text-sm flex items-center gap-1">
                    <Cloud className="w-4 h-4" />
                    {t.weatherCondition}
                  </div>
                </div>
              </div>
              
              {/* Mini forecast */}
              <div className="grid grid-cols-5 gap-2 mt-6 pt-4 border-t border-primary-foreground/10">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                  <div key={day} className="text-center">
                    <div className="text-primary-foreground/50 text-xs mb-1">{day}</div>
                    <Sun className="w-4 h-4 mx-auto text-accent/80" />
                    <div className="text-primary-foreground text-xs font-medium mt-1">
                      {28 + i}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
