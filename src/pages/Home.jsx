import React, { useState } from 'react';
import Header from '../components/Header';
import CurrentWeather from '../components/CurrentWeather';
import FiveDay from '../components/FiveDay';
import fetchWeather from "../utils/fetchWeather";
import { toast } from "react-toastify";

function Home() {
/********************* City Handling ****************/
 /* This will check to see if we have a city name stored, if we dont set the state to empty string */
  const [city, setCity] = useState(() => {
    const currentCity = localStorage.getItem("currentCity");
    return currentCity ? JSON.parse(currentCity) : "";
  });

  /* We will pass this as a prop to the header which contains the city search input,
   from there we will update the "city" state and set the local storage for persistency */
  const handleCityChange = (event) => {
    let city = event.target.value.trim().toUpperCase();
    localStorage.setItem("currentCity",JSON.stringify(city))
  };


  /****************** API data Handling ****************/
  // This will save the weather data from the search to local storage and enable persistency on page refresh 
  const [weatherData, setWeatherData] = useState(() => {
    const storedData = localStorage.getItem('weatherData');
    return storedData ? JSON.parse(storedData) : "";
  });


  // Func to get weather, passed as a prop to the header
  const getWeather = async () => {
   
      const response = await fetchWeather.getWeather();
      if (response.status === 200) {
          const data = response.newData;
          setWeatherData(data);
          localStorage.setItem('weatherData', JSON.stringify(data));
          return response.status;
      } else {
        return;
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
      <Header onClick={getWeather} onClickButton={onClickButton} onChange={handleCityChange}  />
      {weatherData && <CurrentWeather data={weatherData} city={city} />}
      {weatherData && <FiveDay data={weatherData} city={city} />}
    </div>
  );
}

export default Home;