import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

const FarmerDashboard = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [reports, setReports] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reportsRes, consultsRes] = await Promise.all([
                    fetch('/api/interactions/reports/mine', {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    }),
                    fetch('/api/interactions/consultations/mine', {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);

                const reportsData = await reportsRes.json();
                const consultsData = await consultsRes.json();

                setReports(reportsData);
                setConsultations(consultsData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
            case 'submitted':
                return <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" /> {status}</Badge>;
            case 'responded':
            case 'investigating':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">{status}</Badge>;
            case 'resolved':
            case 'closed':
                return <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {status}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-24 sm:py-32">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
                    <p className="text-muted-foreground">Manage your farm activities and advisory requests.</p>
                </div>

                <Tabs defaultValue="reports" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="reports" className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            My Reports
                        </TabsTrigger>
                        <TabsTrigger value="consultations" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Consultations
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="reports" className="space-y-4 pt-4">
                        {!Array.isArray(reports) || reports.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    No farm problems reported yet.
                                </CardContent>
                            </Card>
                        ) : (
                            reports.map((report: any) => (
                                <Card key={report.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">{report.problemType}</CardTitle>
                                            <CardDescription>{report.location}</CardDescription>
                                        </div>
                                        {getStatusBadge(report.status)}
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Submitted on {format(new Date(report.createdAt), 'PPP')}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="consultations" className="space-y-4 pt-4">
                        {!Array.isArray(consultations) || consultations.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    No consultation requests yet.
                                </CardContent>
                            </Card>
                        ) : (
                            consultations.map((consult: any) => (
                                <Card key={consult.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg">{consult.subject}</CardTitle>
                                        {getStatusBadge(consult.status)}
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">{consult.message}</p>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Requested on {format(new Date(consult.createdAt), 'PPP')}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default FarmerDashboard;
