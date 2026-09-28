// client/src/components/ForecastCard.js

import React from 'react';

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
  // Construct the full URL for the weather icon provided by OpenWeatherMap.
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    // This div is the main container for a single forecast card.
    // Using a specific className makes it easy to style.
    <div className="forecast-card">
      <h3 className="forecast-day">{day}</h3>
      <img src={iconUrl} alt="Weather icon" className="forecast-icon" />
      <div className="forecast-temps">
        <span className="temp-high">{Math.round(tempHigh)}{unitSymbol}</span>
        <span className="temp-low">{Math.round(tempLow)}{unitSymbol}</span>
      </div>
    </div>
  );
}

// Export the component so it can be used by other files, specifically
// our upcoming `Forecast.js` component.
export default ForecastCard;