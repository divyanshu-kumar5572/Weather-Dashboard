// client/src/App.jsx

// 1. Import all the necessary child components and the main CSS file.
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import SearchForm from './components/SearchForm';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherChart from './components/WeatherChart';
import './App.css';

// The App component is the top-level component that acts as the main container for our application.
function App() {
  // The 'return' statement defines the layout of our application by assembling our imported components.
  const [weatherData, setWeatherData] = useState(null);

  
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  useEffect(() => {
    // This is the existing logic to load the search history.
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }

    // This is our new logic to check for and load the default city.
    const defaultCity = localStorage.getItem('defaultCity');
    
    // We check if a value was actually found for 'defaultCity'.
    if (defaultCity) {
      // If it exists, we call our main fetchWeather function to automatically
      // load the weather for the user's preferred location on startup.
      fetchWeather(defaultCity);
    }
  }, []);
  const handleSetDefault = (city) => {
    // We use localStorage.setItem() to save the value.
    // The first argument, 'defaultCity', is the key we will use to retrieve it later.
    // The second argument, `city`, is the value we are saving.
    localStorage.setItem('defaultCity', city);
    // It's good practice to give the user immediate feedback that the action was successful.
    // A simple alert is fine for now.
    alert(`${city} has been set as your default city!`);
  };


  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    
    try {
      
      const response = await axios.get(`/api/weather?city=${city}`);

      
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
        {/*
          We render the SearchForm component here. React will replace this tag
          with the entire JSX returned by the SearchForm.js file.
        */}
        <SearchForm onSearch={fetchWeather}/>
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

         {weatherData && !loading && !error && (
          <>
            {/* 
              Pass the `current` property of our weatherData state
              to the `CurrentWeather` component.
            */}
            <CurrentWeather weatherData={weatherData.current} onSetDefault={handleSetDefault}/>
            
            {/* 
              Pass the `forecast` property (the array of 5 days)
              to the `Forecast` component.
            */}
            <Forecast forecastData={weatherData.forecast} />
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