import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sprout, 
  CloudSun, 
  Users, 
  BookOpen, 
  BarChart3, 
  MessageCircle,
  Microscope,
  Map
} from "lucide-react";

interface ServicesSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    badge: "Our Services",
    title: "Everything You Need to",
    titleHighlight: "Succeed in Agriculture",
    subtitle: "Comprehensive digital tools and expert guidance designed specifically for Malawian farmers and agricultural consultants.",
    services: [
      {
        icon: Sprout,
        title: "Crop Advisory",
        description: "Personalized recommendations for planting, fertilization, and pest management based on your specific conditions.",
      },
      {
        icon: CloudSun,
        title: "Weather Alerts",
        description: "Real-time weather forecasts and alerts tailored to your location to help you plan farming activities.",
      },
      {
        icon: Users,
        title: "Expert Consultants",
        description: "Connect with certified agricultural consultants for one-on-one guidance and farm visits.",
      },
      {
        icon: BookOpen,
        title: "Knowledge Hub",
        description: "Access a library of farming guides, videos, and audio content in Chichewa and English.",
      },
      {
        icon: Microscope,
        title: "Soil Testing",
        description: "Upload and track soil test results with recommendations for soil improvement.",
      },
      {
        icon: BarChart3,
        title: "Farm Analytics",
        description: "Track your farm's performance with visual dashboards and yield predictions.",
      },
      {
        icon: Map,
        title: "GIS Mapping",
        description: "Visualize your farm boundaries and crop distribution with interactive maps.",
      },
      {
        icon: MessageCircle,
        title: "WhatsApp Support",
        description: "Get quick answers and alerts directly through WhatsApp messaging.",
      },
    ],
  },
  ny: {
    badge: "Ntchito Zathu",
    title: "Zonse Zomwe Mukufuna kuti",
    titleHighlight: "Mupambane Paulimi",
    subtitle: "Zipangizo za digito ndi malangizo a akatswiri opangidwa makamaka kwa alimi ndi aphunzitsi aulimi a ku Malawi.",
    services: [
      {
        icon: Sprout,
        title: "Uphungu wa Mbeu",
        description: "Malangizo a mbeu, feteleza, ndi tizilombo malinga ndi mkhalidwe wanu.",
      },
      {
        icon: CloudSun,
        title: "Machenjezo a Nyengo",
        description: "Ulosere wa nyengo watsopano wa malo anu kuti muthandizidwe kukonzekera ntchito zaulimi.",
      },
      {
        icon: Users,
        title: "Aphunzitsi Odziwa",
        description: "Lumikizanani ndi aphunzitsi aulimi ovomerezeka kuti mupeze malangizo ndi kuyendera munda.",
      },
      {
        icon: BookOpen,
        title: "Malo Ophunzirira",
        description: "Pezani mabuku aulimi, makanema, ndi nyimbo mu Chichewa ndi Chingerezi.",
      },
      {
        icon: Microscope,
        title: "Kuyeza Dothi",
        description: "Ikani ndipo tsatirani zotsatira za kuyeza dothi ndi malangizo okonza dothi.",
      },
      {
        icon: BarChart3,
        title: "Kuunika Munda",
        description: "Tsatirani momwe munda wanu ukuyendera ndi zithunzi ndi kulosera zokolola.",
      },
      {
        icon: Map,
        title: "Mapu a GIS",
        description: "Onani malire a munda wanu ndi kugawika kwa mbeu ndi mapu osankha.",
      },
      {
        icon: MessageCircle,
        title: "Thandizo la WhatsApp",
        description: "Pezani mayankho mwachangu ndi machenjezo kudzera pa WhatsApp.",
      },
    ],
  },
};

export function ServicesSection({ language }: ServicesSectionProps) {
  const t = translations[language];

  return (
    <section id="services" className="section-padding bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Sprout className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">{t.title}</span>
            <br />
            <span className="text-primary">{t.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                variant="feature"
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
