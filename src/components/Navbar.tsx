import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  language: "en" | "ny";
  onLanguageChange: (lang: "en" | "ny") => void;
}

const translations = {
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    farmers: "For Farmers",
    consultants: "For Consultants",
    contact: "Contact",
    getStarted: "Get Started",
  },
  ny: {
    home: "Kunyumba",
    about: "Za Ife",
    services: "Ntchito",
    farmers: "Kwa Alimi",
    consultants: "Kwa Aphunzitsi",
    contact: "Tilumikizane",
    getStarted: "Yambani",
  },
};

export function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: t.home },
    { to: "/about", label: t.about },
    { to: "/services", label: t.services },
    { to: "/farmers", label: t.farmers },
    { to: "/contact", label: t.contact },
  ];

  const isHomePage = location.pathname === "/";
  const shouldUseTransparent = isHomePage && !isScrolled;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        shouldUseTransparent
          ? "bg-transparent py-5"
          : "bg-background/95 backdrop-blur-md shadow-soft py-3"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-primary-foreground font-bold text-lg">MA</span>
            </div>
            <div className="hidden sm:block">
              <span className={cn(
                "font-bold text-lg transition-colors",
                shouldUseTransparent ? "text-primary-foreground" : "text-foreground"
              )}>
                Mlimi Anyamuke
              </span>
              <span className={cn(
                "text-sm block -mt-1 transition-colors",
                shouldUseTransparent ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                Initiative
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary/10",
                  shouldUseTransparent 
                    ? "text-primary-foreground hover:bg-primary-foreground/10" 
                    : "text-foreground",
                  location.pathname === link.to && "bg-primary/10 text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(language === "en" ? "ny" : "en")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
                shouldUseTransparent 
                  ? "bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              )}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium uppercase">{language}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* CTA Button */}
            <Button
              variant={shouldUseTransparent ? "hero-accent" : "default"}
              size={shouldUseTransparent ? "lg" : "default"}
              className="hidden sm:flex"
            >
              {t.getStarted}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                shouldUseTransparent ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          )}
        >
          <div className="bg-card rounded-2xl shadow-card p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl font-medium hover:bg-muted transition-colors",
                  location.pathname === link.to 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="default" className="w-full mt-4">
              {t.getStarted}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
