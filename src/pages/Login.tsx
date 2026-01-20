import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogIn, UserPlus } from 'lucide-react';

const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const { login } = useAuth();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const translations = {
        en: {
            title: "Login to Mlimi Anyamuke",
            subtitle: "Access your farmer dashboard or admin panel",
            username: "Username",
            password: "Password",
            usernamePlaceholder: "Enter your username",
            passwordPlaceholder: "Enter your password",
            loginButton: "Login",
            loggingIn: "Logging in...",
            noAccount: "Don't have an account?",
            registerHere: "Register as a Farmer",
            adminNote: "Administrators: Login with your admin credentials",
            loginSuccess: "Login successful! Welcome back.",
            loginError: "Invalid username or password"
        },
        ny: {
            title: "Lowani mu Mlimi Anyamuke",
            subtitle: "Lowani mu dashboard yanu ya mlimi kapena admin",
            username: "Dzina Lolowera",
            password: "Mawu Achinsinsi",
            usernamePlaceholder: "Lowetsani dzina lanu lolowera",
            passwordPlaceholder: "Lowetsani mawu achinsinsi",
            loginButton: "Lowani",
            loggingIn: "Mukulowa...",
            noAccount: "Mulibe akaunti?",
            registerHere: "Lembetsani Ngati Mlimi",
            adminNote: "Ma Administrator: Lowani ndi chidziwitso chanu cha admin",
            loginSuccess: "Kulowa kwapambana! Takulandirani.",
            loginError: "Dzina lolowera kapena mawu achinsinsi sakugwirizana"
        }
    };

    const t = translations[language];

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || t.loginError);
            }

            login(result.token, result.user);
            toast.success(t.loginSuccess);

            // Redirect based on user role
            if (result.user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/farmer-dashboard');
            }
        } catch (error: any) {
            toast.error(error.message || t.loginError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                        <LogIn className="w-6 h-6" />
                        {t.title}
                    </CardTitle>
                    <CardDescription>{t.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.username}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t.usernamePlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.password}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder={t.passwordPlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? t.loggingIn : t.loginButton}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {t.noAccount}{' '}
                            <Link to="/register" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                                <UserPlus className="w-4 h-4" />
                                {t.registerHere}
                            </Link>
                        </p>
                        <p className="text-xs text-muted-foreground italic border-t pt-3">
                            {t.adminNote}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
