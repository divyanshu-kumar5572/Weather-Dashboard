import React from 'react';
import { formatTemperature } from '../utils/temperature';
import { getWeatherIcon } from '../utils/weatherIconMap';

function ForecastCard({ dayData, unit }) {
  const { day,condition, icon, tempHigh, tempLow } = dayData;
const unitSymbol = unit === 'metric' ? '°C' : '°F';
const displayHigh = formatTemperature(tempHigh, unit);
  const displayLow = formatTemperature(tempLow, unit);
  // Construct the full URL for the weather icon provided by OpenWeatherMap.
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="forecast-card">
      <h4>{day}</h4>
      <div className="weather-icon-small">
        {getWeatherIcon(condition, icon)}
      </div>
      <p>High: {displayHigh}{unitSymbol}</p>
      <p>Low: {displayLow}{unitSymbol}</p>
    </div>
  );
}

export default ForecastCard;