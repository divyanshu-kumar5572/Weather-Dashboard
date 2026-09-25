require('dotenv').config();
// 1. Import the Express library
// The 'require' function is the core way Node.js includes modules from other files.
// Here, we are loading the 'express' package from our node_modules folder.
// The 'const' keyword ensures that the 'express' variable cannot be reassigned.
const express = require('express');
const axios = require('axios');

// 2. Create an instance of the Express application
// We execute the express function we just imported to create our application object.
// By convention, this object is always named 'app'. This 'app' object is the heart
// of our server; it has methods for handling requests, configuring middleware, and starting the server.
const app = express();
app.get('/api/weather', async (req, res) => {
  try {
    // Extract the city from the query parameters.
    const { city } = req.query;

    // It's a good practice to validate that the city was provided.
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    // Retrieve the API key from our environment variables.
    const apiKey = process.env.WEATHER_API_KEY;

    // Construct the URL for the OpenWeatherMap API request.
    // We are using the 'Current weather data' endpoint.
    // We add `&units=metric` to get the temperature in Celsius.
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(forecastUrl);
    const forecastData = response.data;

    // 2. Process the complex response into a clean, simple format.
    
    // Create the 'current' weather object from the first item in the forecast list.
    const currentWeatherData = {
      city: forecastData.city.name,
      country: forecastData.city.country,
      temperature: forecastData.list[0].main.temp,
      feelsLike: forecastData.list[0].main.feels_like,
      humidity: forecastData.list[0].main.humidity,
      windSpeed: forecastData.list[0].wind.speed,
      condition: forecastData.list[0].weather[0].main,
      description: forecastData.list[0].weather[0].description,
      icon: forecastData.list[0].weather[0].icon,
    };

    // Process the 5-day forecast data.
    // We'll group the 3-hour forecasts by day and find the min/max temps.
    const dailyForecasts = {};
    forecastData.list.forEach(item => {
      // Get the date (e.g., "November 21, 2023") from the timestamp
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      if (!dailyForecasts[date]) {
        // If we haven't seen this day before, initialize it.
        dailyForecasts[date] = {
          day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temps: [],
          icons: new Set(), // Use a Set to store unique icon codes for the day
        };
      }
      
      // Add the temperature and icon for this 3-hour block to the day's data.
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].icons.add(item.weather[0].icon);
    });

    // Now, map over the grouped data to create a clean forecast array.
    const processedForecast = Object.values(dailyForecasts).map(dayData => ({
      day: dayData.day,
      tempHigh: Math.max(...dayData.temps),
      tempLow: Math.min(...dayData.temps),
      // For simplicity, we'll just pick one icon. A more advanced method could pick the most frequent.
      icon: dayData.icons.values().next().value, 
    })).slice(0, 5); // Ensure we only return 5 days.

    // 3. Combine both processed data parts into a single response object.
    const processedData = {
      current: currentWeatherData,
      forecast: processedForecast,
    };

    res.json(processedData);

  } catch (error) {
    // Log the detailed error to the server console for debugging.
    // error.response.data often contains a useful message from the API provider.
    console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
    
    // Send a user-friendly error response to the client.
    // We check for a specific 404 error from the API (city not found).
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'City not found. Please check the spelling.' });
    }
    
    // For all other errors, send a generic 500 Internal Server Error.
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});
// 3. Define the port for our server
// It is a crucial best practice to make the port configurable via environment variables.
// 'process.env.PORT' is the standard way to access a port number provided by a hosting
// service (like Render, Vercel, or Heroku) in a production environment.
// The '|| 5000' provides a default value. If `process.env.PORT` is not set (like when we
// run it on our local machine), the server will use port 5000.
const PORT = process.env.PORT || 5000;

// 4. Start the server and listen for incoming requests
// The app.listen() method binds and listens for connections on the specified port.
// It's the command that actually starts the server process.
// The first argument is the port number.
// The second argument is a callback function that will be executed once the server
// has successfully started. This is the perfect place to log a confirmation
// message to the console so we know our server is running.
app.listen(PORT, () => {
  // This message will appear in your terminal, providing immediate feedback that
  // the server is up and running correctly.
  console.log(`Server is now listening with nodemon on port ${PORT}`);
});