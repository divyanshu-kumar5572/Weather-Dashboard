
import React from 'react';

// For this static build, we'll create a dummy data object to populate our component.
// This allows us to see how the component will look with actual data,
// without needing a live API connection yet.

// Our component is a function that accepts an object of 'props' as its argument.
// Here, we are using ES6 destructuring to pull the `weatherData` property directly from the props object.
// If no weatherData is passed, we'll use our dummyData as a default.
function CurrentWeather({ weatherData, onSetDefault }) {
  // We can further destructure the weatherData object for cleaner access in our JSX.
  const { city, country, temperature, description, icon, humidity, windSpeed, feelsLike } = weatherData;

  // The 'iconUrl' will eventually point to the weather icons from OpenWeatherMap.
  // We construct the URL using the icon code from our data.
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="current-weather">
      <h2 className="city-name">{city}, {country}</h2>
      <div className="weather-main">
        <img src={iconUrl} alt={description} className="weather-icon" />
        <p className="temperature">{Math.round(temperature)}°C</p>
      </div>
      <p className="weather-description">{description}</p>
      <div className="weather-details">
        <p>Feels like: {Math.round(feelsLike)}°C</p>
        <p>Humidity: {humidity}%</p>
        <p>Wind: {windSpeed} m/s</p>
      </div>
       <button 
        onClick={() => onSetDefault(city)} 
        className="btn-set-default"
      >
        Set as Default
      </button>
    </div>
  );
}

export default CurrentWeather;