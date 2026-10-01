import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { formatTemperature } from '../utils/temperature';
import { getWeatherIcon } from '../utils/weatherIconMap';

function CurrentWeather({ weatherData, onSetDefault, unit }) {
  
  const { isAuthenticated, token } = useContext(AuthContext);

  const [favoriteStatus, setFavoriteStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const { city, temp, condition, icon } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
const unitSymbol = unit === 'metric' ? '°C' : '°F';
const displayTemp = formatTemperature(temp, unit);
  const handleAddFavorite = async () => {
    setFavoriteStatus({ loading: true, error: null, success: null });

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      await axios.post('/api/favorites', { city }, config);

      setFavoriteStatus({ loading: false, success: 'Added to favorites!', error: null });
      setTimeout(() => setFavoriteStatus({ ...favoriteStatus, success: null }), 3000);

    } catch (err) {
      
      const message = err.response?.data?.message || 'Could not add to favorites.';
      setFavoriteStatus({ loading: false, error: message, success: null });
    }
  };

  return (
    <div className="current-weather">
      <h2>{city}</h2>
      <div className="weather-details">
        <div className="weather-icon-large">
          {getWeatherIcon(condition, icon)}
        </div>
        <p className="temperature">{displayTemp}{unitSymbol}</p>
        <p className="condition">{condition}</p>
      </div>

      {isAuthenticated && (
        <div className="favorites-actions">
          <button 
            onClick={handleAddFavorite} 
            className="btn-favorite"
            disabled={favoriteStatus.loading} // Disable button while loading
          >
            {favoriteStatus.loading ? 'Adding...' : 'Add to Favorites'}
          </button>
          
          {favoriteStatus.success && <p className="success-message-local">{favoriteStatus.success}</p>}
          {favoriteStatus.error && <p className="error-message-local">{favoriteStatus.error}</p>}
        </div>
      )}

      <button onClick={() => onSetDefault(city)} className="btn-default">
        Set as Default
      </button>
    </div>
  );
}

export default CurrentWeather;