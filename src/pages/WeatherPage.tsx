import { Suspense, useEffect } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import WeatherDashboard from "@/components/WeatherDashboard";
import { analytics } from "@/utils/analytics";

const WeatherPage = () => {
  useEffect(() => {
    analytics.page('WeatherPage');
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner message="Loading weather data..." />}>
      <WeatherDashboard />
    </Suspense>
  );
};

export default WeatherPage;