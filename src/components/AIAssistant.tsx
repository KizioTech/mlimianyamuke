import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Message {
    role: "assistant" | "user";
    content: string;
}

const AIAssistant: React.FC = () => {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: language === "en"
                ? "Hello! I am your Mlimi Assistant. How can I help you with your farming today?"
                : "Muli bwanji! Ndine mthandizi wanu wa Mlimi. Kodi ndingakuthandizeni bwanji ndi ulimi wanu lero?"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            // Simple rule-based logic for now
            // In a real app, this would call a backend endpoint that uses Gemini/OpenAI
            setTimeout(() => {
                let response = "";
                const lowerInput = userMessage.toLowerCase();

                if (language === "en") {
                    if (lowerInput.includes("maize")) response = "For maize, ensure early planting with first stable rains. Apply basal fertilizer (23:21:0+4S) at planting.";
                    else if (lowerInput.includes("weather")) response = "You can check the local weather in the Weather section of this platform.";
                    else if (lowerInput.includes("pest")) response = "Monitor for Fall Armyworm. Early detection is key to saving your crop.";
                    else response = "That's a great question about Malawian agriculture. I recommend consulting an expert for specific details, but generally, local conditions vary by district.";
                } else {
                    if (lowerInput.includes("chimanga")) response = "Pa chimanga, onetsetsani kuti mwa bzala msanga ndi mvula yoyamba. Thirani feteleza wa basal (23:21:0+4S) pobzala.";
                    else if (lowerInput.includes("nyengo")) response = "Mutha kuona nyengo ya kumudzi kwanu mu gawo la Weather pa nsanja ino.";
                    else if (lowerInput.includes("tizilombo")) response = "Yang'anirani mphutsi zam m'masamba (Fall Armyworm). Kuzindikira msanga ndiko kofunika kuti mupulumutse mbewu zanu.";
                    else response = "Limenelo ndi funso labwino kwambiri pankhani ya ulimi ku Malawi. Ndikukulimbikitsani kukaonana ndi katswiri kuti mudziwe zambiri.";
                }

                setMessages((prev) => [...prev, { role: "assistant", content: response }]);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            setIsLoading(false);
            toast.error("Error connecting to assistant");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-transform"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            ) : (
                <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5">
                    <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-xl flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <CardTitle className="text-lg">Mlimi AI Assistant</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 overflow-hidden">
                        <ScrollArea className="h-full pr-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === "assistant"
                                                    ? "bg-muted text-foreground rounded-tl-none"
                                                    : "bg-primary text-primary-foreground rounded-tr-none"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                {m.role === "assistant" ? (
                                                    <Bot className="h-3 w-3" />
                                                ) : (
                                                    <User className="h-3 w-3" />
                                                )}
                                                <span className="text-[10px] font-bold uppercase opacity-50">
                                                    {m.role === "assistant" ? "Assistant" : "You"}
                                                </span>
                                            </div>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-xs">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex w-full items-center space-x-2"
                        >
                            <Input
                                placeholder={language === "en" ? "Ask a question..." : "Funsani funso..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={isLoading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default AIAssistant;
