// client/src/App.jsx

// 1. Import all the necessary child components and the main CSS file.
import { useState, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import SearchForm from './components/SearchForm';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherChart from './components/WeatherChart';
import FavoritesList from './components/FavoritesList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthContext } from './context/AuthContext';
import './App.css';
import ToggleSwitch from './components/ToggleSwitch';
// The App component is the top-level component that acts as the main container for our application.
function App() {
  const { isAuthenticated, user, token} = useContext(AuthContext);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
    const defaultCity = localStorage.getItem('defaultCity');
        if (defaultCity) {
      fetchWeather(defaultCity);
    }
  }, []);
  const handleSetDefault = (city) => {
    localStorage.setItem('defaultCity', city);
    alert(`${city} has been set as your default city!`);
  };
const [unit, setUnit] = useState(() => {
    return localStorage.getItem('unit') || 'metric';
  });
useEffect(() => {
    if (isAuthenticated && user?.unitPreference) {
      // If the user is logged in and has a preference saved in their profile,
      // we update our local UI state to match it. This is the source of truth.
      setUnit(user.unitPreference);
    } else {
      // If the user logs out, we fall back to what's in localStorage or the default.
      setUnit(localStorage.getItem('unit') || 'metric');
    }
  }, [user, isAuthenticated]);
  // 2. Use a `useEffect` hook to save the unit to localStorage whenever it changes.
  useEffect(() => {
    // Always save to localStorage for instant persistence for all users.
    localStorage.setItem('unit', unit);

    // If the user is authenticated, we also save their preference to the database.
    if (isAuthenticated && token) {
      // We define an async function to perform this "fire-and-forget" update.
      const updateUserPreferenceInDb = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          // Call the new PUT endpoint we created.
          await axios.put('/api/user/preferences', { unit }, config);
        } catch (error) {
          // We log the error but don't show a blocking message, as this is a background task.
          console.error('Failed to sync unit preference to DB:', error);
        }
      };

      updateUserPreferenceInDb();
    }
  }, [unit, isAuthenticated, token]);
  
  // 3. Create the handler function for the toggle switch.
  const handleUnitToggle = () => {
    // This function simply toggles the state between 'metric' and 'imperial'.
    setUnit(prevUnit => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    
    try {
      
      const response = await axios.get('/api/weather', { params: { city } });

      
      setWeatherData(response.data);
       const newCity = response.data.current.city; // Get the properly cased city name from the response

      // Create the new history array with our robust logic.
      const updatedHistory = [
        newCity,
        // Filter out the new city if it already exists to prevent duplicates.
        ...searchHistory.filter(item => item.toLowerCase() !== newCity.toLowerCase())
      ].slice(0, 8); // Limit the history to the 8 most recent searches.

      // 1. Update the React state.
      setSearchHistory(updatedHistory);

      // 2. Update the browser's localStorage.
      // We must convert our array to a JSON string because localStorage can only store strings.
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

    } catch (err) {
      
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      
      
      setError(errorMessage);

    } finally {
      
      setLoading(false);
    }
  };
  const [geolocationError, setGeolocationError] = useState('');

  // 2. Define the event handler for our new button.
  const handleGeolocationClick = () => {
    // Clear out any previous errors from both sources.
    setError(null);
    setGeolocationError('');

    // First, check if the geolocation API is even available in the browser.
    if (!navigator.geolocation) {
      setGeolocationError('Geolocation is not supported by your browser.');
      return; // Stop the function here if not supported.
    }

    setLoading(true); // Show the user we're working on it.

    // 3. Call the core Geolocation API method.
    navigator.geolocation.getCurrentPosition(
      // 4. The SUCCESS callback function.
     async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 2. Make the API call to our new backend endpoint.
          //    We use the `params` option in the axios config object. Axios will
          //    automatically and safely construct the URL query string for us,
          //    resulting in a call to: /api/weather/coords?lat=...&lon=...
          const res = await axios.get('/api/weather/coords', {
            params: { lat: latitude, lon: longitude }, 
          });

          // 3. Update the state with the weather data received from the backend.
          //    This is the same state update as in your `fetchWeather` function,
          //    which will cause the entire dashboard to re-render with the new data.
          setWeatherData(res.data);
          setError(null); // Clear any previous search errors.

        } catch (err) {
          // 4. Handle any errors that might occur during the API call.
          console.error('Failed to fetch weather by coordinates:', err);
          setError('Could not fetch weather data for your location. Please try again.');
        } finally {
          // 5. CRITICAL: No matter if the call succeeded or failed, we must stop loading.
          setLoading(false);
        }
      },
      // 5. The ERROR callback function.
      (err) => {
        let message = '';
        // A switch statement is a clean way to handle the different error codes.
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'You denied the request for Geolocation. Please enable it in your browser settings to use this feature.';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'Location information is currently unavailable.';
            break;
          case err.TIMEOUT:
            message = 'The request to get your location timed out.';
            break;
          default:
            message = 'An unknown error occurred while getting your location.';
            break;
        }
        setGeolocationError(message); // Update our dedicated error state.
        setLoading(false); // Always stop loading, even on error.
      }
    );
  };

  return (
    
    <>
      {/* 3. The Navbar is placed outside of <Routes>, so it will be visible on all pages. */}
      <Navbar />

      <div className="App">
        {/* 4. The <Routes> component acts as a container for all our individual routes.
            It will only render the component of the first <Route> that matches the current URL. */}
        <Routes>
          {/* 5. The Route for the Homepage. */}
          <Route 
            path="/" 
            element={
              // The `element` prop takes the JSX to be rendered for this path.
              // We are placing all the original dashboard JSX here.
              <>
      <header>
        <h1>Weather Dashboard</h1>
        <ToggleSwitch unit={unit} onToggle={handleUnitToggle} />
        {/*
          We render the SearchForm component here. React will replace this tag
          with the entire JSX returned by the SearchForm.js file.
        */}
        <div className="search-container">
        <SearchForm onSearch={fetchWeather}/>
        
        <button type="button" className="btn-geolocation" onClick={handleGeolocationClick}>
                      Use My Location
                    </button>
                    </div>
        {isAuthenticated && <FavoritesList onFavoriteClick={fetchWeather} />}
        {searchHistory.length > 0 && (
          <div className="search-history">
            <h3>Recent Searches</h3>
            <ul className="history-list">
              {/* 
                We map over the `searchHistory` array. For each `city` string in the array,
                we return a list item `<li>` element.
              */}
              {searchHistory.map(city => (
                <li 
                  key={city} 
                  className="history-item"
                  
                  onClick={() => fetchWeather(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
      {/*
        The <main> tag is also for semantic purposes, designating the primary
        content of the document.
      */}
      <main>
        {loading && <p className="loading-message">Loading...</p>}

        {error && !loading && <p className="error-message">{error}</p>}

        {geolocationError && <p className="error-message">{geolocationError}</p>}

         {weatherData && !loading && !error && (
          <>
            {/* 
              Pass the `current` property of our weatherData state
              to the `CurrentWeather` component.
            */}
            <CurrentWeather weatherData={weatherData.current} onSetDefault={handleSetDefault} unit={unit}/>
            
            {/* 
              Pass the `forecast` property (the array of 5 days)
              to the `Forecast` component.
            */}
            <Forecast forecastData={weatherData.forecast} unit={unit}/>
             {(() => {
              
              const chartData = weatherData.forecast.map(day => ({
                name: day.day,
                temperature: Math.round(day.tempHigh),
              }));
              
              return <WeatherChart data={chartData} />;
            })()}
          </>
        )}
      </main>
      </>
            }
          />
       <Route path="/login" element={<LoginPage />} />

          {/* 7. The Route for the Registration Page. */}
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
    </div>
    </>
  );
}

// Export the App component so that it can be rendered by `main.jsx`.
export default App;