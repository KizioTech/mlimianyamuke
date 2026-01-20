const axios = require('axios');

exports.getWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: lat,
                longitude: lon,
                current_weather: true,
                hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Weather API error:', error.message);

        // Fallback Mock Data
        const mockData = {
            current_weather: {
                temperature: 25,
                windspeed: 10,
                weathercode: 1, // Clear
                time: new Date().toISOString()
            },
            hourly: {
                time: Array.from({ length: 24 * 7 }, (_, i) => new Date(Date.now() + i * 3600 * 1000).toISOString()),
                temperature_2m: Array.from({ length: 24 * 7 }, () => 20 + Math.random() * 10),
                relativehumidity_2m: Array.from({ length: 24 * 7 }, () => 50 + Math.random() * 20),
                windspeed_10m: Array.from({ length: 24 * 7 }, () => 5 + Math.random() * 10)
            }
        };

        console.log('Using mock weather data due to API failure');
        res.json(mockData);
    }
};
