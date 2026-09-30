import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import userRoutes from './routes/user.js';
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/user', userRoutes);
const processWeatherData = (currentData, forecastData) => {
  const currentWeather = {
    city: currentData.name,
    temp: currentData.main.temp,
    condition: currentData.weather[0].main,
    description: currentData.weather[0].description,
    icon: currentData.weather[0].icon,
  };

  const dailyForecasts = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temps: [],
        icons: [],
        conditions: [],
      };
    }
    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].icons.push(item.weather[0].icon);
    dailyForecasts[date].conditions.push(item.weather[0].main);
  });

  const forecast = Object.keys(dailyForecasts).slice(0, 5).map(date => {
    const dayData = dailyForecasts[date];
    const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
    const icon = dayData.icons.sort((a,b) => dayData.icons.filter(v => v===a).length - dayData.icons.filter(v => v===v).length).pop();

    return {
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: avgTemp,
      tempHigh: Math.max(...dayData.temps),
      tempLow: Math.min(...dayData.temps),
      condition: dayData.conditions[0], 
      icon: icon,
    };
  });

  return { current: currentWeather, forecast };
};

// 2. THE EXISTING CITY-BASED WEATHER ROUTE (NOW REFACTORED)
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ message: 'City parameter is required' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
    // Make parallel API requests for efficiency
    const [currentWeatherRes, forecastRes] = await Promise.all([
      axios.get(currentWeatherUrl),
      axios.get(forecastUrl),
    ]);

    // Use our reusable processing function
    const processedData = processWeatherData(currentWeatherRes.data, forecastRes.data);
    res.json(processedData);

  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Failed to fetch weather data' });
  }
});

// 3. THE NEW COORDINATE-BASED WEATHER ROUTE
app.get('/api/weather/coords', async (req, res) => {
  // Extract latitude and longitude from the query parameters
  const { lat, lon} = req.query;

  // Validate that both parameters were provided
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude parameters are required' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  // Construct the API URLs using coordinates instead of a city name
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    // The rest of the logic is identical to the city-based search!
    // This is the power of our refactoring.
    const [currentWeatherRes, forecastRes] = await Promise.all([
      axios.get(currentWeatherUrl),
      axios.get(forecastUrl),
    ]);
    
    // Use the exact same reusable processing function
    const processedData = processWeatherData(currentWeatherRes.data, forecastRes.data);
    res.json(processedData);

  } catch (error) {
    console.error('Error fetching weather data by coords:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Failed to fetch weather data' });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});