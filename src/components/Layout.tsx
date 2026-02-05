import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    // Track page view
    fetch('/api/admin/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname })
    }).catch(err => {
      // Silently fail for analytics
      console.error('Analytics error:', err);
    });
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />
      <main className="pt-20">{children}</main>
      <Footer language={language} />
    </div>
  );
}
