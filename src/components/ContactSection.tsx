import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, MessageCircle, Send, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { analytics } from "@/utils/analytics";

interface ContactSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    badge: "Contact Us",
    title: "Let's Start a",
    titleHighlight: "Conversation",
    subtitle: "Have questions about our services? Want to partner with us? We'd love to hear from you.",
    form: {
      name: "Your Name",
      email: "Email Address",
      phone: "Phone Number",
      message: "Your Message",
      submit: "Send Message",
      sending: "Sending...",
    },
    contact: {
      title: "Get in Touch",
      address: "Dowa, Malawi",
      phone: "+265 894 199 625",
      email: "mzungap@gmail.com",
      hours: "Mon - Fri: 8:00 AM - 5:00 PM",
    },
    whatsapp: {
      title: "Chat on WhatsApp",
      description: "Get quick answers to your questions through WhatsApp",
      button: "Start Chat",
    },
    success: "Message sent successfully! We'll get back to you soon.",
  },
  ny: {
    badge: "Tilumikizane",
    title: "Tiyeni Tiyambe",
    titleHighlight: "Kukambirana",
    subtitle: "Muli ndi mafunso okhudza ntchito zathu? Mukufuna kugwira ntchito nafe? Tikufuna kumva kuchokera kwa inu.",
    form: {
      name: "Dzina Lanu",
      email: "Imelo Yanu",
      phone: "Nambala ya Foni",
      message: "Uthenga Wanu",
      submit: "Tumizani Uthenga",
      sending: "Kutumiza...",
    },
    contact: {
      title: "Tilumikizane",
      address: "Dowa, Malawi",
      phone: "+265 894 199 625",
      email: "mzungap@gmail.com",
      hours: "Mon - Fri: 8:00 AM - 5:00 PM",
    },
    whatsapp: {
      title: "Lankhulani pa WhatsApp",
      description: "Pezani mayankho mwachangu ku mafunso anu kudzera pa WhatsApp",
      button: "Yambani Kukambirana",
    },
    success: "Uthenga watumizidwa bwino! Tikubwerera kwa inu posachedwapa.",
  },
};

export function ContactSection({ language }: ContactSectionProps) {
  const t = translations[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use backend API for contact form submission
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          language,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Track contact form submission
        analytics.track('contact_form_submitted', {
          language
        });

        toast.success(t.success);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(language === "en"
        ? "Failed to send message. Please try again."
        : "Kulephera kutumiza uthenga. Yesaninso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      language === "en"
        ? "Hello! I'm interested in Mlimi Anyamuke Initiative services."
        : "Moni! Ndili ndi chidwi ndi ntchito za Mlimi Anyamuke Initiative."
    );

    window.open(`https://wa.me/265996058928?text=${message}`, "_blank");
  };

  return (
    <section id="contact" className="section-padding bg-secondary/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Mail className="w-4 h-4 text-primary" />
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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.form.name}
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Banda"
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.form.email}
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@gmail.com"
                      required
                      className="h-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.form.phone}
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+265 894 199 625"
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.form.message}
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    required
                    rows={5}
                    className="resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.form.sending : t.form.submit}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card variant="elevated">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-foreground mb-6">{t.contact.title}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Address</div>
                      <div className="text-muted-foreground">{t.contact.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Phone</div>
                      <div className="text-muted-foreground">{t.contact.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <div className="text-muted-foreground">{t.contact.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Hours</div>
                      <div className="text-muted-foreground">{t.contact.hours}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Card */}
            <Card variant="gradient" className="border-l-4 border-l-accent overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{t.whatsapp.title}</h3>
                    <p className="text-muted-foreground text-sm">{t.whatsapp.description}</p>
                  </div>
                </div>
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.whatsapp.button}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
