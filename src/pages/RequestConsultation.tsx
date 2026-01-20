import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { MessageSquare, Calendar, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RequestConsultation = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });

    const translations = {
        en: {
            title: "Request a Consultation",
            subtitle: "Get professional advice from our agricultural experts.",
            subject: "Consultation Subject",
            placeholderSubject: "e.g. Irrigation Planning, Crop Rotation Tips",
            message: "Your Message / Question",
            placeholderMessage: "What would you like to discuss with an expert?",
            submit: "Request Consultation",
            success: "Request submitted! An agent will contact you soon.",
        },
        ny: {
            title: "Pemphani Malangizo",
            subtitle: "Landirani malangizo kwa akatswiri athu a ulimi.",
            subject: "Mutu wa Malangizo",
            placeholderSubject: "mwachitsanzo Kukonzekera Kuthirira, Malangizo Olesera Zomera",
            message: "Uthenga / Funso Lanu",
            placeholderMessage: "Kodi mungafune kukambirana chiyani ndi katswiri?",
            submit: "Pemphani Malangizo",
            success: "Pempho latumizidwa! Wothandizira adzakulumikizani posachedwa.",
        }
    };

    const t = translations[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) {
            return toast.error("Please fill in all fields");
        }

        setLoading(true);
        try {
            const response = await fetch('/api/interactions/consultations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success(t.success);
                navigate('/farmer-dashboard');
            } else {
                throw new Error("Failed to submit request");
            }
        } catch (error) {
            toast.error("Error submitting request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 sm:py-32">
            <div className="max-w-2xl mx-auto">
                <Card className="border-primary-100 shadow-lg">
                    <CardHeader className="text-center bg-primary/5 rounded-t-xl">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">{t.title}</CardTitle>
                        <CardDescription>{t.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.subject}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder={t.placeholderSubject}
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.message}</label>
                                <Textarea
                                    placeholder={t.placeholderMessage}
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Submitting..." : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-4 h-4" /> {t.submit}
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RequestConsultation;
