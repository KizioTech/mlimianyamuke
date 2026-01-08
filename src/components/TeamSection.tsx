import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, Linkedin } from "lucide-react";

interface TeamSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    badge: "Our Team",
    title: "Meet the",
    titleHighlight: "Experts",
    subtitle: "Our team combines decades of agricultural expertise with modern technology to serve Malawian farmers.",
    team: [
      {
        name: "Dr. Chisomo Mwale",
        role: "Founder & Lead Agronomist",
        bio: "PhD in Agricultural Science from LUANAR with 15+ years experience in crop advisory.",
      },
      {
        name: "Mercy Chirwa",
        role: "Head of Farmer Relations",
        bio: "Former extension officer with deep connections across all 28 districts of Malawi.",
      },
      {
        name: "James Kondowe",
        role: "Technology Director",
        bio: "Software engineer focused on building accessible tech solutions for rural communities.",
      },
      {
        name: "Grace Nyirenda",
        role: "Climate Specialist",
        bio: "Meteorologist specializing in agricultural weather forecasting and climate adaptation.",
      },
    ],
  },
  ny: {
    badge: "Gulu Lathu",
    title: "Kukumana ndi",
    titleHighlight: "Akatswiri",
    subtitle: "Gulu lathu limagwirizanitsa zaka zambiri za luso laulimi ndi ukadaulo wamakono kuti litumikire alimi aku Malawi.",
    team: [
      {
        name: "Dr. Chisomo Mwale",
        role: "Woyambitsa & Mkulu wa Agronomy",
        bio: "PhD mu Agricultural Science kuchokera ku LUANAR ndi zaka 15+ za ntchito mu uphungu wa mbeu.",
      },
      {
        name: "Mercy Chirwa",
        role: "Mkulu wa Ubale ndi Alimi",
        bio: "Kale anali extension officer wokhala ndi maubwenzi m'maboma onse 28 a ku Malawi.",
      },
      {
        name: "James Kondowe",
        role: "Mkulu wa Teknoloje",
        bio: "Software engineer wofunitsitsa kupanga mayankho a teknoloji osavuta kwa anthu akumidzi.",
      },
      {
        name: "Grace Nyirenda",
        role: "Katswiri wa Nyengo",
        bio: "Meteorologist wodzipereka pa kulosera nyengo yaulimi ndi kutsatira kusintha kwa nyengo.",
      },
    ],
  },
};

export function TeamSection({ language }: TeamSectionProps) {
  const t = translations[language];

  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">{t.title}</span>{" "}
            <span className="text-primary">{t.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.team.map((member, index) => (
            <Card key={index} variant="elevated" className="group text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                  <span className="text-2xl font-bold text-primary group-hover:text-primary-foreground transition-colors">
                    {member.name.split(" ").map(n => n.charAt(0)).join("")}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">{member.name}</h3>
                <p className="text-accent text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
