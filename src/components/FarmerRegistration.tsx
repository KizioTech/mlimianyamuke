import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { analytics } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";

interface FormData {
  phone: string;
  name: string;
  district: string;
  crop: string;
  alertMethod: string;
  username: string;
  password: string;
}

const FarmerRegistration: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    name: "",
    district: "",
    crop: "",
    alertMethod: "",
    username: "",
    password: "",
  });

  const translations = {
    en: {
      title: "Register Your Farmer Account",
      subtitle: "Join the digital community and get personalized advisory",
      step1: "Phone Number",
      step2: "Your Name",
      step3: "District",
      step4: "Main Crop",
      step5: "Alert Method",
      step6: "Account Security",
      placeholderPhone: "Enter your phone number (e.g. 0991234567)",
      placeholderName: "Enter your full name",
      placeholderUsername: "Choose a username",
      placeholderPassword: "Create a password",
      selectDistrict: "Select your district",
      selectCrop: "Select your main crop",
      selectAlert: "How would you like to receive alerts?",
      next: "Next",
      back: "Back",
      register: "Create Account & Register",
      success: "Registration successful! Redirecting to login...",
      successMessage: "Account created successfully! You can now log in with your credentials.",
      phoneError: "Please enter a valid Malawi phone number",
      nameError: "Please enter your name",
      districtError: "Please select your district",
      cropError: "Please select your main crop",
      alertError: "Please select an alert method",
      accountError: "Username must be at least 3 chars and password 6 chars",
    },
    ny: {
      title: "Lembetsani Akaunti Yanu ya Alimi",
      subtitle: "Lowani nawo gulu la digito ndi kulandira malangizo anu",
      step1: "Nambala ya Foni",
      step2: "Dzina Lanu",
      step3: "Chigawo",
      step4: "Chomera Chachikulu",
      step5: "Njira Yotumizira Machenjezo",
      step6: "Chitetezo cha Akaunti",
      placeholderPhone: "Lowetsani nambala ya foni yanu (mwachitsanzo 0991234567)",
      placeholderName: "Lowetsani dzina lanu lonse",
      placeholderUsername: "Sankhani dzina lolowera",
      placeholderPassword: "Pangani mawu achinsinsi",
      selectDistrict: "Sankhani chigawo chanu",
      selectCrop: "Sankhani chomera chachikulu",
      selectAlert: "Mukufuna kulandira machenjezo bwanji?",
      next: "Pita Mtsogolo",
      back: "Bwerera",
      register: "Pangani Akaunti ndi Kulembetsa",
      success: "Kulembetsa kwapambana! Tikukutumizani ku login...",
      successMessage: "Akaunti yapangidwa bwino! Mutha kulowa ndi chidziwitso chanu tsopano.",
      phoneError: "Chonde lowetsani nambala ya foni yovomerezeka ya ku Malawi",
      nameError: "Chonde lowetsani dzina lanu",
      districtError: "Chonde sankhani chigawo chanu",
      cropError: "Chonde sankhani chomera chachikulu",
      alertError: "Chonde sankhani njira yotumizira machenjezo",
      accountError: "Dzina lolowera likhale ndi zilembo 3 ndipo password zilembo 6",
    },
  };

  const t = translations[language];

  const districts = [
    "Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa", "Dedza", "Dowa", "Karonga",
    "Kasungu", "Likoma", "Lilongwe", "Machinga", "Mangochi", "Mchinji", "Mulanje",
    "Mwanza", "Mzimba", "Neno", "Nkhotakota", "Nsanje", "Ntcheu", "Ntchisi", "Phalombe",
    "Rumphi", "Salima", "Thyolo", "Zomba"
  ];

  const crops = [
    "Maize", "Rice", "Tobacco", "Groundnuts", "Soybeans", "Cotton", "Tea", "Coffee",
    "Cassava", "Sweet Potatoes", "Irish Potatoes", "Beans", "Pigeon Peas", "Sorghum"
  ];

  const alertMethods = [
    { value: "sms", label: language === "en" ? "SMS" : "SMS" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "both", label: language === "en" ? "Both SMS and WhatsApp" : "SMS ndi WhatsApp zonse" },
  ];

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    return /^(265)?(0?)(88|99|77)\d{7}$/.test(cleaned);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return validatePhone(formData.phone);
      case 2:
        return formData.name.trim().length >= 2;
      case 3:
        return formData.district !== "";
      case 4:
        return formData.crop !== "";
      case 5:
        return formData.alertMethod !== "";
      case 6:
        return formData.username.length >= 3 && formData.password.length >= 6;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      if (step < 6) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    } else {
      showError();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const showError = () => {
    let errorMessage = "";
    switch (step) {
      case 1:
        errorMessage = t.phoneError;
        break;
      case 2:
        errorMessage = t.nameError;
        break;
      case 3:
        errorMessage = t.districtError;
        break;
      case 4:
        errorMessage = t.cropError;
        break;
      case 5:
        errorMessage = t.alertError;
        break;
      case 6:
        errorMessage = t.accountError;
        break;
    }
    toast.error(errorMessage);
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting registration with data:', formData);

      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          language: language // Add current language
        })
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (data.success) {
        toast.success(t.success);
        analytics.track('farmer_registered', { language, district: formData.district });
        setFormData({
          phone: "",
          name: "",
          district: "",
          crop: "",
          alertMethod: "",
          username: "",
          password: "",
        });
        setStep(1);

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error('Registration failed:', data);
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">{t.step1}</label>
            <Input
              type="tel"
              placeholder={t.placeholderPhone}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="text-lg"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">{t.step2}</label>
            <Input
              type="text"
              placeholder={t.placeholderName}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-lg"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">{t.step3}</label>
            <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value })}>
              <SelectTrigger className="text-lg">
                <SelectValue placeholder={t.selectDistrict} />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">{t.step4}</label>
            <Select value={formData.crop} onValueChange={(value) => setFormData({ ...formData, crop: value })}>
              <SelectTrigger className="text-lg">
                <SelectValue placeholder={t.selectCrop} />
              </SelectTrigger>
              <SelectContent>
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">{t.step5}</label>
            <Select value={formData.alertMethod} onValueChange={(value) => setFormData({ ...formData, alertMethod: value })}>
              <SelectTrigger className="text-lg">
                <SelectValue placeholder={t.selectAlert} />
              </SelectTrigger>
              <SelectContent>
                {alertMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">{t.step6}</label>
            <Input
              placeholder={t.placeholderUsername}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder={t.placeholderPassword}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">{t.title}</CardTitle>
          <p className="text-muted-foreground">{t.subtitle}</p>
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${i <= step ? "bg-primary" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          <div className="flex space-x-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {step === 6 ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t.register}
                </>
              ) : (
                <>
                  {t.next}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerRegistration;