import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown, User, LogOut, LayoutDashboard, FileText, Cloud, Lightbulb, MessageSquare, AlertTriangle, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.jpeg";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  language: "en" | "ny";
  onLanguageChange: (lang: "en" | "ny") => void;
}

const translations = {
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    weather: "Weather",
    farmers: "For Farmers",
    resources: "Resources",
    blog: "Blog",
    contact: "Contact",
    getStarted: "Get Started",
    login: "Sign In",
    dashboard: "Dashboard",
    logout: "Logout",
    report: "Report Problem",
    consult: "Request Consultation",
  },
  ny: {
    home: "Kunyumba",
    about: "Za Ife",
    services: "Ntchito",
    weather: "Nyengo",
    farmers: "Kwa Alimi",
    resources: "Zolemba",
    blog: "Blog",
    contact: "Tilumikizane",
    getStarted: "Yambani",
    login: "Lowani",
    dashboard: "Dashboard",
    logout: "Tulukani",
    report: "Nenani Vuto",
    consult: "Pemphani Malangizo",
  },
};

export function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
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
    { to: "/contact", label: t.contact },
  ];

  const farmerLinks = [
    { to: "/my-farm", label: "My Farm", icon: Sprout },
    { to: "/services", label: t.services, icon: Lightbulb },
    { to: "/weather", label: t.weather, icon: Cloud },
    { to: "/resources", label: t.resources, icon: FileText },
    { to: "/blog", label: t.blog, icon: MessageSquare },
  ];

  const interactiveLinks = [
    { to: "/report-problem", label: t.report, icon: AlertTriangle },
    { to: "/consultations", label: t.consult, icon: MessageSquare },
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
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow overflow-hidden">
              <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
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

            {/* For Farmers Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary/10 outline-none",
                    shouldUseTransparent
                      ? "text-primary-foreground hover:bg-primary-foreground/10"
                      : "text-foreground"
                  )}
                >
                  {t.farmers} <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2">
                <DropdownMenuLabel className="text-xs uppercase text-muted-foreground px-2 py-1">Information</DropdownMenuLabel>
                {farmerLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className="flex items-center gap-2 cursor-pointer">
                      <link.icon className="w-4 h-4 text-primary" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs uppercase text-muted-foreground px-2 py-1">Interactive</DropdownMenuLabel>
                {interactiveLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className="flex items-center gap-2 cursor-pointer text-orange-600 font-medium">
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                {isAuthenticated && !isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/farmer-dashboard" className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                        <LayoutDashboard className="w-4 h-4" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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

            {/* Auth Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={shouldUseTransparent ? "hero-accent" : "default"} size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={isAdmin ? "/dashboard" : "/farmer-dashboard"} className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> {t.dashboard}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" /> {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant={shouldUseTransparent ? "hero-accent" : "default"}
                size={shouldUseTransparent ? "lg" : "default"}
                className="hidden sm:flex"
                asChild
              >
                <Link to="/login">{t.login}</Link>
              </Button>
            )}

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
            isMobileMenuOpen ? "max-h-[80vh] mt-4" : "max-h-0"
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

            <div className="pt-2 pb-1 px-4 text-xs font-bold text-muted-foreground uppercase">{t.farmers}</div>
            {farmerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium hover:bg-muted"
              >
                <link.icon className="w-4 h-4 text-primary" />
                {link.label}
              </Link>
            ))}

            <div className="pt-2 pb-1 px-4 text-xs font-bold text-muted-foreground uppercase">Interactive</div>
            {interactiveLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium hover:bg-muted text-orange-600"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <Button variant="default" className="w-full mt-4" asChild>
                <Link to="/login">{t.login}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
