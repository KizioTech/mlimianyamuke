import { useEffect } from "react";
import FarmerRegistration from "@/components/FarmerRegistration";
import { useLanguage } from "@/contexts/LanguageContext";
import { analytics } from "@/utils/analytics";

const RegisterPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    analytics.page('RegisterPage');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <FarmerRegistration />
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Are you an administrator? <a href="/login" className="text-primary hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;