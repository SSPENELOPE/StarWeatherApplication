/* eslint-disable class-methods-use-this */
import { toast } from 'react-toastify';

class FetchWeather {
  async getWeather() {
    const cityInput =
      document.getElementById('profCity') || document.getElementById('city');
    const city = cityInput.value;

    const weatherUrl = `https://starweatherapi.azurewebsites.net/api/GetWeatherCity/GetWeather?cityName=${city}`;
    return fetch(weatherUrl, {
      method: 'GET',
      cache: 'reload',
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
        toast.error(`We do not have data for a city with that name`, {
          position: toast.POSITION.TOP_CENTER,
          draggable: false,
        });
      });
  }

  async getWeatherButton(city) {
    const weatherUrl = `https://starweatherapi.azurewebsites.net/api/GetWeatherCity/GetWeather?cityName=${city}`;
    return fetch(weatherUrl, {
      method: 'GET',
      cache: 'reload',
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
        toast.error(`We do not have data for a city with that name`, {
          position: toast.POSITION.TOP_CENTER,
          draggable: false,
        });
      });
  }
}

export default new FetchWeather();
