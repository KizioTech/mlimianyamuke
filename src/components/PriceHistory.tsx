import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const data = [
    { month: "Jan", maize: 12000, rice: 25000, tobacco: 45000 },
    { month: "Feb", maize: 13500, rice: 26000, tobacco: 46000 },
    { month: "Mar", maize: 15000, rice: 27500, tobacco: 47000 },
    { month: "Apr", maize: 11000, rice: 28000, tobacco: 48500 },
    { month: "May", maize: 10000, rice: 26500, tobacco: 44000 },
    { month: "Jun", maize: 9500, rice: 25000, tobacco: 42000 },
];

const PriceHistory: React.FC = () => {
    const { language } = useLanguage();

    const translations = {
        en: {
            title: "Market Price Trends",
            subtitle: "Price history for major commodities (MWK per 50kg bag)",
            maize: "Maize",
            rice: "Rice",
            tobacco: "Tobacco",
        },
        ny: {
            title: "Mitengo ya pa Msika",
            subtitle: "Mbiri ya mitengo ya mbewu zazikulu (MWK pa thumba la 50kg)",
            maize: "Chimanga",
            rice: "Mpunga",
            tobacco: "Fodya",
        },
    };

    const t = translations[language];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="maize"
                                name={t.maize}
                                stroke="#1e7a3d"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rice"
                                name={t.rice}
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="tobacco"
                                name={t.tobacco}
                                stroke="#92400e"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default PriceHistory;
