import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { AlertTriangle, MapPin, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReportProblem = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        problemType: "",
        description: "",
        location: "",
    });

    const translations = {
        en: {
            title: "Report a Farm Problem",
            subtitle: "Tell us about pests, diseases, or soil issues in your farm.",
            type: "Type of Problem",
            placeholderType: "e.g. Unusual Pests, Crop Yellowing",
            location: "Location / Section of Farm",
            placeholderLocation: "e.g. North block, Near the stream",
            description: "Detailed Description",
            placeholderDescription: "Describe exactly what you are seeing and when it started.",
            submit: "Submit Report",
            success: "Problem reported successfully! Our team will investigate.",
        },
        ny: {
            title: "Nenani Vuto la pa Farm",
            subtitle: "Tiuzeni za tizirombo, matenda, kapena mavuto a nthaka mu famu yanu.",
            type: "Mtundu wa Vuto",
            placeholderType: "mwachitsanzo Tizirombo zachilendo, Chomera chachikasu",
            location: "Malo kapena Gawo la Farm",
            placeholderLocation: "mwachitsanzo Block ya kumpoto, pafupi ndi mtsinje",
            description: "Kufotokozera Mwatsatanetsatane",
            placeholderDescription: "Fotokozani ndendende zomwe mukuona komanso nthawi yomwe zinayamba.",
            submit: "Tumizani Ripoti",
            success: "Vuto lanenedwa bwino! Gulu lathu lidzafufuza.",
        }
    };

    const t = translations[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.problemType || !formData.description || !formData.location) {
            return toast.error("Please fill in all fields");
        }

        setLoading(true);
        try {
            const response = await fetch('/api/interactions/reports', {
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
                throw new Error("Failed to submit report");
            }
        } catch (error) {
            toast.error("Error submitting report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 sm:py-32">
            <div className="max-w-2xl mx-auto">
                <Card className="border-orange-100 shadow-lg">
                    <CardHeader className="text-center bg-orange-50/50 rounded-t-xl">
                        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">{t.title}</CardTitle>
                        <CardDescription>{t.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.type}</label>
                                <Input
                                    placeholder={t.placeholderType}
                                    value={formData.problemType}
                                    onChange={(e) => setFormData({ ...formData, problemType: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.location}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder={t.placeholderLocation}
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.description}</label>
                                <Textarea
                                    placeholder={t.placeholderDescription}
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
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

export default ReportProblem;
