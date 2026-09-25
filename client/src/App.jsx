// client/src/App.jsx

// 1. Import all the necessary child components and the main CSS file.
import { useState } from 'react';
import axios from 'axios';
import SearchForm from './components/SearchForm';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import './App.css';

// The App component is the top-level component that acts as the main container for our application.
function App() {
  // The 'return' statement defines the layout of our application by assembling our imported components.
  const [weatherData, setWeatherData] = useState(null);

  
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      
      const response = await axios.get(`/api/weather?city=${city}`);

      
      setWeatherData(response.data);

    } catch (err) {
      
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      
      
      setError(errorMessage);

    } finally {
      
      setLoading(false);
    }
  };
  return (
    
    <div className="App">
      {/*
        The <header> tag is used for semantic HTML, indicating that this section
        contains introductory content or navigational links.
      */}
      <header>
        <h1>Weather Dashboard</h1>
        {/*
          We render the SearchForm component here. React will replace this tag
          with the entire JSX returned by the SearchForm.js file.
        */}
        <SearchForm onSearch={fetchWeather}/>
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
            <CurrentWeather weatherData={weatherData.current} />
            
            {/* 
              Pass the `forecast` property (the array of 5 days)
              to the `Forecast` component.
            */}
            <Forecast forecastData={weatherData.forecast} />
          </>
        )}
        <CurrentWeather />
        <Forecast />
      </main>
      
    </div>
  );
}

// Export the App component so that it can be rendered by `main.jsx`.
export default App;