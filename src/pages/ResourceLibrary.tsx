import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Resource {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
    category: string;
    createdAt: string;
}

const ResourceLibrary: React.FC = () => {
    const { language } = useLanguage();
    const [resources, setResources] = useState<Resource[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        try {
            const response = await fetch('/api/resources');
            const data = await response.json();
            setResources(data);
        } catch (error) {
            toast.error("Failed to load resources");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase())
    );

    const translations = {
        en: {
            title: "Farmer Resource Library",
            subtitle: "Download technical guides, manuals, and advisory documents.",
            search: "Search guides...",
            download: "Download PDF",
            category: "Category",
            noResources: "No resources found."
        },
        ny: {
            title: "Mabungwe Ophunzirira Alimi",
            subtitle: "Tsitsani zitsogozo zamankhwala, timabuku, ndi zolemba zina.",
            search: "Sakani zitsogozo...",
            download: "Tsitsani PDF",
            category: "Gulu",
            noResources: "Palibe zolemba zomwe zapezeka."
        }
    };

    const t = translations[language];

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary mb-4">{t.title}</h1>
                    <p className="text-muted-foreground text-lg">{t.subtitle}</p>
                </div>

                <div className="max-w-2xl mx-auto mb-10 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            placeholder={t.search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {filteredResources.map((resource) => (
                        <Card key={resource.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3 text-center">
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{resource.title}</CardTitle>
                                <span className="inline-block mt-2 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
                                    {resource.category}
                                </span>
                            </CardHeader>
                            <CardContent className="text-center pb-6">
                                <p className="text-muted-foreground text-sm line-clamp-3">
                                    {resource.description}
                                </p>
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                                <Button className="w-full gap-2" variant="outline" asChild>
                                    <a href={resource.fileUrl} download target="_blank">
                                        <Download className="h-4 w-4" />
                                        {t.download}
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {filteredResources.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 bg-white rounded-xl border-dashed border-2">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                            <p className="text-muted-foreground">{t.noResources}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceLibrary;
