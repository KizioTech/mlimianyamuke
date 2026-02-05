import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useState, useEffect } from "react";

interface TestimonialsSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    badge: "Success Stories",
    title: "What Farmers",
    titleHighlight: "Are Saying",
    realTestimonials: false, // NEW FLAG
    testimonials: [
      {
        quote: "Mlimi Anyamuke Initiative helped me double my maize yield this season. The weather alerts saved my crops from unexpected rains.",
        name: "Grace Banda",
        location: "Kasungu District",
        role: "Maize Farmer",
      },
      {
        quote: "The soil testing service showed me exactly what fertilizers I needed. I've saved money and improved my harvest.",
        name: "John Phiri",
        location: "Mchinji District",
        role: "Tobacco Farmer",
      },
      {
        quote: "Being able to consult experts in Chichewa made all the difference. Finally, advice I can understand and apply.",
        name: "Mary Tembo",
        location: "Dedza District",
        role: "Vegetable Farmer",
      },
    ],
  },
  ny: {
    badge: "Nkhani Zopambana",
    title: "Zimene Alimi",
    titleHighlight: "Akunena",
    realTestimonials: false, // NEW FLAG
    testimonials: [
      {
        quote: "Mlimi Anyamuke Initiative andithandiza kuwonjezererapo chimanga changa kawiri nyengo ino. Machenjezo a nyengo anapulumutsa mbeu zanga ku mvula yodzidzimutsa.",
        name: "Grace Banda",
        location: "Boma la Kasungu",
        role: "Mlimi wa Chimanga",
      },
      {
        quote: "Ntchito yokuyeza dothi inandisonyeza feteleza zomwe ndinkafunika. Ndapulumutsa ndalama ndikupititsa patsogolo zokolola zanga.",
        name: "John Phiri",
        location: "Boma la Mchinji",
        role: "Mlimi wa Fodya",
      },
      {
        quote: "Kutha kufunsira akatswiri mu Chichewa kunasiyanasiyana. Pamapeto pake, malangizo omwe ndingamvetse ndikugwiritsa ntchito.",
        name: "Mary Tembo",
        location: "Boma la Dedza",
        role: "Mlimi wa Masamba",
      },
    ],
  },
};

export function TestimonialsSection({ language }: TestimonialsSectionProps) {
  const t = translations[language];
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/testimonials/featured')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else {
          // Fallback to static if no real ones
          setTestimonials([]);
        }
      })
      .catch(err => console.error("Failed to fetch testimonials:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Use static as fallback if real ones are empty AND we are not loading? 
  // Or just show "No testimonials yet"? 
  // Prompt said "remove fake ones". So if real is empty, maybe show nothing?
  // Let's show static ONLY if real fetch failed or returned 0, so the site doesn't look empty initially.
  // Actually user explicitly asked to "remove the fake ones". So if 0, show 0.
  const displayTestimonials = testimonials.length > 0 ? testimonials : (isLoading ? [] : []);

  if (!isLoading && displayTestimonials.length === 0) {
    // If user wants to remove fake ones, and we have no real ones, maybe hide section or show "Coming Soon"
    return null;
  }

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-foreground">{t.title}</span>{" "}
            <span className="text-primary">{t.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <Card key={index} variant="elevated" className="relative">
              <CardContent className="p-6 pt-8">
                <Quote className="w-10 h-10 text-primary/20 absolute top-4 left-4" />
                <p className="text-muted-foreground mb-6 relative z-10 italic leading-relaxed">
                  "{testimonial.content || testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-accent">{testimonial.location || "Farmer"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
