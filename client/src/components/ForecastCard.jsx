// client/src/components/ForecastCard.js

import React from 'react';
import { formatTemperature } from '../utils/temperature';

// To build our component in isolation, we'll create a dummy data object.
// This represents the data for a single day in the forecast.
const dummyForecastData = {
  day: "Tue",
  icon: "10d", // Example icon code for 'rain'
  tempHigh: 19,
  tempLow: 12,
};

// Our component function accepts a 'dayData' prop.
// We use destructuring and a default value, just like in the CurrentWeather component.
// This pattern makes our components predictable and easy to test.
function ForecastCard({ dayData, unit }) {
  // Destructure the properties from the dayData object for clean, direct access in the JSX.
  const { day, icon, tempHigh, tempLow } = dayData;
const unitSymbol = unit === 'metric' ? '°C' : '°F';
const displayHigh = formatTemperature(tempHigh, unit);
  const displayLow = formatTemperature(tempLow, unit);
  // Construct the full URL for the weather icon provided by OpenWeatherMap.
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="forecast-card">
      <h4>{day}</h4>
      <img src={iconUrl} alt="weather icon" />
      <p>High: {displayHigh}{unitSymbol}</p>
      <p>Low: {displayLow}{unitSymbol}</p>
    </div>
  );
}

// Export the component so it can be used by other files, specifically
// our upcoming `Forecast.js` component.
export default ForecastCard;