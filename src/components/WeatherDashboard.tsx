import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { analytics } from "@/utils/analytics";

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: number;
    description: string;
    icon: string;
    rain: number;
  }>;
}

const WeatherDashboard: React.FC = () => {
  const { language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState("Lilongwe");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    en: {
      title: "Weather Dashboard",
      subtitle: "Real-time weather and farming advice for your district",
      selectDistrict: "Select District",
      currentWeather: "Current Weather",
      temperature: "Temperature",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      forecast: "7-Day Forecast",
      farmingAdvice: "Farming Advice",
      loading: "Loading weather data...",
      error: "Failed to load weather data. Please try again.",
      noData: "No weather data available",
    },
    ny: {
      title: "Bolodi la Nyengo",
      subtitle: "Nyengo yeniyeni ndi uphungu wa ulimi wa chigawo chanu",
      selectDistrict: "Sankhani Chigawo",
      currentWeather: "Nyengo Yapanopo",
      temperature: "Kutentha",
      humidity: "Chinyezi",
      windSpeed: "Kuthamanga kwa Mphepo",
      forecast: "Zolosera za Masiku 7",
      farmingAdvice: "Uphungu wa Ulimi",
      loading: "Kukweza deta ya nyengo...",
      error: "Kulephera kukweza deta ya nyengo. Yesaninso.",
      noData: "Palibe deta ya nyengo yomwe ilipo",
    },
  };

  const t = translations[language];

  const districts = [
    "Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa", "Dedza", "Dowa", "Karonga",
    "Kasungu", "Likoma", "Lilongwe", "Machinga", "Mangochi", "Mchinji", "Mulanje",
    "Mwanza", "Mzimba", "Neno", "Nkhotakota", "Nsanje", "Ntcheu", "Ntchisi", "Phalombe",
    "Rumphi", "Salima", "Thyolo", "Zomba"
  ];

  // Mock data for demonstration - replace with real API call
  const mockWeatherData: WeatherData = {
    current: {
      temp: 28,
      humidity: 65,
      windSpeed: 12,
      description: "Partly cloudy",
      icon: "02d",
    },
    forecast: [
      { date: "2024-01-09", temp: 29, description: "Sunny", icon: "01d", rain: 0 },
      { date: "2024-01-10", temp: 27, description: "Light rain", icon: "10d", rain: 2.5 },
      { date: "2024-01-11", temp: 26, description: "Cloudy", icon: "03d", rain: 0 },
      { date: "2024-01-12", temp: 28, description: "Sunny", icon: "01d", rain: 0 },
      { date: "2024-01-13", temp: 30, description: "Sunny", icon: "01d", rain: 0 },
      { date: "2024-01-14", temp: 29, description: "Partly cloudy", icon: "02d", rain: 0 },
      { date: "2024-01-15", temp: 27, description: "Rain", icon: "10d", rain: 5.2 },
    ],
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env?.REACT_APP_WEATHERBIT_API_KEY || (typeof process !== 'undefined' ? process.env?.REACT_APP_WEATHERBIT_API_KEY : null);

        if (!apiKey) {
          throw new Error('Weatherbit API key not configured');
        }


        // District coordinates (approximate)
        const districtCoordinates: { [key: string]: { lat: number; lon: number } } = {
          'Balaka': { lat: -14.98, lon: 34.95 },
          'Blantyre': { lat: -15.78, lon: 35.00 },
          'Chikwawa': { lat: -16.03, lon: 34.80 },
          'Chiradzulu': { lat: -15.70, lon: 35.17 },
          'Chitipa': { lat: -9.70, lon: 33.27 },
          'Dedza': { lat: -14.38, lon: 34.33 },
          'Dowa': { lat: -13.65, lon: 33.93 },
          'Karonga': { lat: -9.93, lon: 33.93 },
          'Kasungu': { lat: -13.03, lon: 33.48 },
          'Likoma': { lat: -12.05, lon: 34.73 },
          'Lilongwe': { lat: -13.96, lon: 33.78 },
          'Machinga': { lat: -15.17, lon: 35.30 },
          'Mangochi': { lat: -14.48, lon: 35.26 },
          'Mchinji': { lat: -13.80, lon: 32.88 },
          'Mulanje': { lat: -16.03, lon: 35.50 },
          'Mwanza': { lat: -15.61, lon: 34.51 },
          'Mzimba': { lat: -11.90, lon: 33.60 },
          'Neno': { lat: -15.56, lon: 34.69 },
          'Nkhotakota': { lat: -12.92, lon: 34.29 },
          'Nsanje': { lat: -16.92, lon: 35.26 },
          'Ntcheu': { lat: -14.82, lon: 34.63 },
          'Ntchisi': { lat: -13.37, lon: 33.91 },
          'Phalombe': { lat: -15.80, lon: 35.65 },
          'Rumphi': { lat: -11.01, lon: 33.86 },
          'Salima': { lat: -13.78, lon: 34.42 },
          'Thyolo': { lat: -16.06, lon: 35.14 },
          'Zomba': { lat: -15.38, lon: 35.30 }
        };

        const coords = districtCoordinates[selectedDistrict] || districtCoordinates['Lilongwe'];

        // Fetch from our backend proxy
        const response = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`);

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        // Process current weather data
        const current = {
          temp: Math.round(data.current_weather.temperature),
          humidity: 60, // OpenMeteo current_weather doesn't give humidity in basic free tier easily without hourly mapping, simplifying for now
          windSpeed: Math.round(data.current_weather.windspeed),
          description: "Clear sky", // Simplification as OpenMeteo uses WMO codes
          icon: "01d", // Default icon
        };

        // Simple WMO code mapping
        const wmoCode = data.current_weather.weathercode;
        if (wmoCode > 3) current.description = "Cloudy";
        if (wmoCode > 45) current.description = "Foggy";
        if (wmoCode > 50) { current.description = "Rain"; current.icon = "10d"; }
        if (wmoCode > 80) { current.description = "Storm"; current.icon = "09d"; }
        if (wmoCode <= 3 && wmoCode > 0) { current.description = "Partly Cloudy"; current.icon = "02d"; }

        // Process forecast data (using hourly data to fake daily for simplicity or just taking noon values)
        // OpenMeteo returns hourly arrays. Let's pick 12:00 PM for each day.
        const dailyForecasts = [];
        const hourly = data.hourly;

        for (let i = 0; i < 7; i++) {
          const index = i * 24 + 12; // Approx noon
          if (index < hourly.time.length) {
            dailyForecasts.push({
              date: hourly.time[index],
              temp: Math.round(hourly.temperature_2m[index]),
              description: "Forecast",
              icon: "01d",
              rain: 0 // Placeholder
            });
          }
        }

        setWeatherData({
          current,
          forecast: dailyForecasts,
        });

        // Track weather view
        analytics.track('weather_viewed', {
          district: selectedDistrict,
          language
        });
      } catch (err) {
        console.error('Weather API error:', err);
        setError(t.error);
        // Fallback to mock data if API fails
        setWeatherData(mockWeatherData);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedDistrict, t.error]);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "01d":
      case "01n":
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  const getFarmingAdvice = (weather: WeatherData) => {
    const { current, forecast } = weather;
    const rainInNext3Days = forecast.slice(0, 3).reduce((sum, day) => sum + day.rain, 0);

    if (language === "en") {
      if (current.temp > 30) {
        return "High temperatures expected. Ensure crops are well-watered and consider shade for seedlings.";
      } else if (rainInNext3Days > 10) {
        return "Heavy rain forecast. Prepare for waterlogging and consider drainage improvements.";
      } else if (current.humidity > 80) {
        return "High humidity may increase disease risk. Monitor crops for fungal infections.";
      } else {
        return "Weather conditions are favorable for most farming activities. Good time for planting and weeding.";
      }
    } else {
      if (current.temp > 30) {
        return "Kutentha kwakukulu kukuyembekezeka. Onetsetsani kuti mbewu zikuthiriridwa bwino ndipo ganizirani mthunzi wa mbewu zazing'ono.";
      } else if (rainInNext3Days > 10) {
        return "Mvula yamphamvu ikuyembekezeka. Konzekerani kuti madzi asamadzi ndipo ganizirani kukonza ngalande.";
      } else if (current.humidity > 80) {
        return "Chinyezi chachikulu chingawonjezere chiopsezo cha matenda. Yang'anirani mbewu za fungal infections.";
      } else {
        return "Mikhalidwe ya nyengo ndi yabwino kwa ntchito zambiri za ulimi. Nthawi yabwino yobzala ndi kufufuta udzu.";
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || t.noData}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="text-sm font-medium">{t.selectDistrict}</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {t.currentWeather}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                {getWeatherIcon(weatherData.current.icon)}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{weatherData.current.temp}°C</p>
                <p className="text-muted-foreground capitalize">{weatherData.current.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-sm text-muted-foreground">{t.humidity}</p>
                  <p className="font-semibold">{weatherData.current.humidity}%</p>
                </div>
                <div>
                  <Wind className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-muted-foreground">{t.windSpeed}</p>
                  <p className="font-semibold">{weatherData.current.windSpeed} km/h</p>
                </div>
                <div>
                  <Thermometer className="w-5 h-5 mx-auto mb-1 text-red-500" />
                  <p className="text-sm text-muted-foreground">{t.temperature}</p>
                  <p className="font-semibold">{weatherData.current.temp}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t.forecast}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      {new Date(day.date).toLocaleDateString(language === "en" ? "en-US" : "ny", { weekday: "short" })}
                    </p>
                    {getWeatherIcon(day.icon)}
                    <p className="text-lg font-bold mt-2">{day.temp}°C</p>
                    <p className="text-xs text-muted-foreground capitalize">{day.description}</p>
                    {day.rain > 0 && (
                      <p className="text-xs text-blue-600">{day.rain}mm</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              {t.farmingAdvice}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{getFarmingAdvice(weatherData)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherDashboard;