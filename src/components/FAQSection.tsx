import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQSectionProps {
  language: "en" | "ny";
}

const translations = {
  en: {
    badge: "FAQ",
    title: "Frequently Asked",
    titleHighlight: "Questions",
    faqs: [
      {
        question: "How do I register as a farmer?",
        answer: "You can register through our mobile app or website. Simply provide your name, phone number, and farm location. Registration is free and takes less than 5 minutes.",
      },
      {
        question: "Is the platform available in Chichewa?",
        answer: "Yes! Our entire platform is available in both English and Chichewa. You can switch languages at any time using the language toggle.",
      },
      {
        question: "How much data does the app use?",
        answer: "We've optimized our platform for low-bandwidth usage. Most features work on 2G networks, and key content can be downloaded for offline access.",
      },
      {
        question: "How do I contact an agricultural consultant?",
        answer: "After registering, you can request a consultation through the app. Our consultants are available for both virtual consultations and in-person farm visits.",
      },
      {
        question: "Is Mlimi Anyamuke Initiative free to use?",
        answer: "Basic features like weather alerts and crop calendars are free. Premium features like personal consultations and detailed soil analysis are available through affordable subscription plans.",
      },
      {
        question: "Which districts do you cover?",
        answer: "We currently operate in all 28 districts of Malawi, with dedicated consultants assigned to each region for localized support.",
      },
    ],
  },
  ny: {
    badge: "Mafunso",
    title: "Mafunso Omwe",
    titleHighlight: "Amafunsidwa Kwambiri",
    faqs: [
      {
        question: "Ndingathe bwanji kulembetsa ngati mlimi?",
        answer: "Mutha kulembetsa kudzera pa app yathu ya foni kapena webusayiti. Perekani dzina lanu, nambala ya foni, ndi malo a munda wanu. Kulembetsa ndi kwaulere ndipo kumatenga mphindi zosachepera 5.",
      },
      {
        question: "Kodi malo awa alipo mu Chichewa?",
        answer: "Inde! Malo athu onse alipo mu Chingerezi ndi Chichewa. Mutha kusintha chilankhulo nthawi iliyonse pogwiritsa ntchito language toggle.",
      },
      {
        question: "Kodi app imagwiritsa ntchito data yochuluka bwanji?",
        answer: "Takonza malo athu kuti agwiritse ntchito data pang'ono. Zambiri zimagwira ntchito pa ma netiweki a 2G, ndipo zinthu zofunikira zitha kutsitsidwa kuti mupeze popanda intaneti.",
      },
      {
        question: "Ndingathe bwanji kulumikizana ndi phunzitsi waulimi?",
        answer: "Mukalembetsa, mutha kupempha kufunsira kudzera mu app. Aphunzitsi athu alipo kwa msonkhano wa pa intaneti komanso kuyendera kumunda.",
      },
      {
        question: "Kodi Mlimi Anyamuke Initiative ndi yaulere kugwiritsa ntchito?",
        answer: "Zinthu zachigawo monga machenjezo a nyengo ndi kalenda ya mbeu ndi zaulere. Zinthu za premium monga msonkhano ndi kuunika kwa dothi zili pa ndondomeko zolipira zosavuta.",
      },
      {
        question: "Kodi mumagwira ntchito mu maboma ati?",
        answer: "Tikugwira ntchito m'maboma onse 28 a ku Malawi, ndi aphunzitsi operekedwa m'dera lililonse kuti apereke thandizo lapafupi.",
      },
    ],
  },
};

export function FAQSection({ language }: FAQSectionProps) {
  const t = translations[language];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-foreground">{t.title}</span>{" "}
            <span className="text-primary">{t.titleHighlight}</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {t.faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
