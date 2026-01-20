import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import FarmersPage from "./pages/FarmersPage";
import WeatherPage from "./pages/WeatherPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import ResourceLibrary from "./pages/ResourceLibrary";
import FarmerDashboard from "./pages/FarmerDashboard";
import ReportProblem from "./pages/ReportProblem";
import RequestConsultation from "./pages/RequestConsultation";
import AIAssistant from "@/components/AIAssistant";
import FarmerCropDashboard from "./pages/FarmerCropDashboard";
import CropDetails from "./pages/CropDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/farmers" element={<FarmersPage />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/resources" element={<ResourceLibrary />} />
                  <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
                  <Route path="/report-problem" element={<ReportProblem />} />
                  <Route path="/consultations" element={<RequestConsultation />} />

                  {/* New Routes */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/login" element={<Login />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/my-farm" element={<FarmerCropDashboard />} />
                    <Route path="/my-farm/crop/:id" element={<CropDetails />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
                <AIAssistant />
              </Layout>
            </BrowserRouter>
          </ErrorBoundary>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
