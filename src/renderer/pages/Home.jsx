import React, { useState, useEffect } from 'react';
import ProfileHeader from 'renderer/components/ProfileHeader';
import Header from '../components/Header';
import CurrentWeather from '../components/CurrentWeather';
import FiveDay from '../components/FiveDay';
import fetchWeather from '../utils/fetchWeather';
import Auth from '../utils/auth';
import Profile from './Profile';

function Home() {
  /* const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = Auth.getToken();
  }) */

  /** ******************* City Handling *************** */
  /* This will check to see if we have a city name stored, if we dont set the state to empty string */
  const [city, setCity] = useState(() => {
    const currentCity = localStorage.getItem('currentCity');
    return currentCity ? JSON.parse(currentCity) : '';
  });

  /* We will pass this as a prop to the header which contains the city search input,
   from there we will update the "city" state and set the local storage for persistency */
  const handleCityChange = (event) => {
    const city = event.target.value.trim().toUpperCase();
    localStorage.setItem('currentCity', JSON.stringify(city));
  };

  /** **************** API data Handling *************** */
  // This will save the weather data from the search to local storage and enable persistency on page refresh
  const [weatherData, setWeatherData] = useState(() => {
    const storedData = localStorage.getItem('weatherData');
    return storedData ? JSON.parse(storedData) : '';
  });

  // Func to get weather, passed as a prop to the header
  const getWeather = async () => {
    const response = await fetchWeather.getWeather();
    if (response.current) {
      setWeatherData(response);
      localStorage.setItem('weatherData', JSON.stringify(response));
      return response;
    }
  };

  const onClickButton = async (city) => {
    try {
      const response = await fetchWeather.getWeatherButton(city);
      setWeatherData(response);
      setCity(city);
      localStorage.setItem('weatherData', JSON.stringify(response));
      localStorage.setItem('currentCity', JSON.stringify(city));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {Auth.loggedIn() ? (
        <Profile />
      ) : (
        <div>
          <Header
            onClick={getWeather}
            onClickButton={onClickButton}
            onChange={handleCityChange}
          />
          <div>
            {weatherData && <CurrentWeather data={weatherData} city={city} />}
            {weatherData && <FiveDay data={weatherData} city={city} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
