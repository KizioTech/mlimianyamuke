import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.jpeg";
import footerBg from "@/assets/footer-farm.jpg"
import { Sprout, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, MessageCircle } from "lucide-react";

interface FooterProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    description: "Empowering Malawian farmers with digital agricultural advisory services, weather alerts, and expert consultancy.",
    quickLinks: "Quick Links",
    links: {
      home: { label: "Home", to: "/" },
      about: { label: "About Us", to: "/about" },
      services: { label: "Services", to: "/services" },
      farmers: { label: "For Farmers", to: "/farmers" },
      contact: { label: "Contact", to: "/contact" },
    },
    resources: "Resources",
    resourceLinks: {
      knowledge: "Knowledge Hub",
      weather: "Weather Updates",
      crops: "Crop Calendar",
      faq: "FAQ",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
    contact: "Contact Info",
    rights: "All rights reserved.",
    tagline: "Growing Together, Harvesting Success",
  },
  ny: {
    description: "Kulimbikitsa alimi a ku Malawi ndi ntchito za uphungu wa ulimi, machenjezo a nyengo, ndi uphungu wa akatswiri.",
    quickLinks: "Maulalo Achangu",
    links: {
      home: { label: "Kunyumba", to: "/" },
      about: { label: "Za Ife", to: "/about" },
      services: { label: "Ntchito", to: "/services" },
      farmers: { label: "Kwa Alimi", to: "/farmers" },
      contact: { label: "Tilumikizane", to: "/contact" },
    },
    resources: "Zothandizira",
    resourceLinks: {
      knowledge: "Malo Ophunzirira",
      weather: "Zosintha za Nyengo",
      crops: "Kalendala ya Mbeu",
      faq: "Mafunso",
      privacy: "Ndondomeko ya Chinsinsi",
      terms: "Mfundo za Ntchito",
    },
    contact: "Malo Otilumikizira",
    rights: "Ufulu wonse usungidwa.",
    tagline: "Timalima Pamodzi, Timakolola Bwino",
  },
};

export function Footer({ language }: FooterProps) {
  const t = translations[language];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary text-primary-foreground overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={footerBg} alt="" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      {/* Main Footer */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-lg">Mlimi Anyamuke</span>
                <span className="text-primary-foreground/70 text-sm block -mt-1">Initiative</span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t.quickLinks}</h4>
            <ul className="space-y-3">
              {Object.values(t.links).map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t.resources}</h4>
            <ul className="space-y-3">
              {Object.entries(t.resourceLinks).map(([key, value]) => (
                <li key={key}>
                  <a
                    href="#"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t.contact}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:mzungap@gmail.com" className="text-primary-foreground/70 hover:text-white transition-colors">mzungap@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+265894199625" className="text-primary-foreground/70 hover:text-white transition-colors">+265 894 199 625</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="https://wa.me/265996058928" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-white transition-colors">+265 996 058 928</a>
              </li>
              <li className="flex items-center gap-3">
                <Facebook className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="https://web.facebook.com/profile.php?id=100095065316526" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-white transition-colors">Mlimi Anyamuke Initiative</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70">Dowa, Malawi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white text-sm font-medium">
              © {currentYear} Mlimi Anyamuke Initiative. {t.rights}
            </p>
            <p className="text-white text-sm italic font-medium">
              {t.tagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
