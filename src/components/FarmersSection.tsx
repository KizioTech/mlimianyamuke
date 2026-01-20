import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Smartphone, Wifi, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

interface FarmersSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    badge: "For Farmers",
    title: "Your Farm,",
    titleHighlight: "Your Pocket",
    subtitle: "Access expert agricultural advice, weather updates, and personalized recommendations right from your phone - even on basic devices with low data.",
    features: [
      "Works on any Android phone",
      "Low data usage - designed for 2G/3G",
      "Available in Chichewa & English",
      "Offline access to key content",
      "Voice-enabled advisory messages",
      "SMS alerts when you need them",
    ],
    cta: "Register as a Farmer",
    secondary: "Check Weather",
    card1Title: "Mobile-First Design",
    card1Desc: "Optimized for the phones Malawian farmers actually use",
    card2Title: "Low Bandwidth",
    card2Desc: "Uses minimal data - perfect for rural areas",
    card3Title: "Audio Support",
    card3Desc: "Listen to advice in your language while you work",
  },
  ny: {
    badge: "Kwa Alimi",
    title: "Munda Wanu,",
    titleHighlight: "M'thumba Mwanu",
    subtitle: "Pezani malangizo aulimi a akatswiri, zosintha za nyengo, ndi malangizo anu kuchokera pa foni yanu - ngakhale pa zida zosavuta ndi data pang'ono.",
    features: [
      "Imagwira ntchito pa foni iliyonse ya Android",
      "Kugwiritsa ntchito data pang'ono - yapangidwa pa 2G/3G",
      "Ilipo mu Chichewa ndi Chingerezi",
      "Kupeza zofunikira popanda intaneti",
      "Mauthenga a malangizo a mawu",
      "Machenjezo a SMS mukafunika",
    ],
    cta: "Lembetsani ngati Mlimi",
    secondary: "Yang'anani Nyengo",
    card1Title: "Yapangidwa pa Foni",
    card1Desc: "Yapangidwa kwa mafoni omwe alimi a ku Malawi amagwiritsa ntchito",
    card2Title: "Data Pang'ono",
    card2Desc: "Imagwiritsa ntchito data pang'ono - yabwino m'madera akutali",
    card3Title: "Thandizo la Mawu",
    card3Desc: "Mverani malangizo mu chilankhulo chanu mukagwira ntchito",
  },
};

export function FarmersSection({ language }: FarmersSectionProps) {
  const t = translations[language];

  return (
    <section id="farmers" className="section-padding bg-secondary/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">{t.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="text-foreground">{t.title}</span>
              <br />
              <span className="text-primary">{t.titleHighlight}</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              {t.subtitle}
            </p>

            {/* Features List */}
            <ul className="grid sm:grid-cols-2 gap-4">
              {t.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" className="group" asChild>
                <Link to="/register">
                  {t.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/weather">
                  {t.secondary}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-4">
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{t.card1Title}</h3>
                  <p className="text-muted-foreground">{t.card1Desc}</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{t.card2Title}</h3>
                  <p className="text-muted-foreground">{t.card2Desc}</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-earth/20 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-7 h-7 text-earth" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{t.card3Title}</h3>
                  <p className="text-muted-foreground">{t.card3Desc}</p>
                </div>
              </CardContent>
            </Card>

            {/* Phone Mockup Placeholder */}
            <div className="hidden xl:block absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-[500px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] border-8 border-foreground/10 shadow-elevated">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-2 bg-foreground/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
