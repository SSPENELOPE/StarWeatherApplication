import { toast } from "react-toastify";
class FetchWeather {
    
    async getWeather() {
      const cityInput = document.getElementById("profCity") || document.getElementById("city");
      const city = cityInput.value;

      const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&exclude=hourly,daily&appid='+process.env.REACT_APP_APPID+'';
      const response = await fetch(weatherUrl, { cache: 'reload' });
      if (!response.ok) {
        toast.error(`${response.statusText}`, {
          position: toast.POSITION.TOP_CENTER,
          draggable: false
      });
      return response.status;
      }
      const data = await response.json();
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const newUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&lang=en&appid='+process.env.REACT_APP_APPID+'';

      const newResponse = await fetch(newUrl, { cache: 'reload' });
      if(!newResponse.ok) {
        toast.error(`${newResponse.statusText}`, {
          position: toast.POSITION.TOP_CENTER,
          draggable: false
      });
      };
      const newData = await newResponse.json();
      const status = newResponse.status;
      const responseObj = {
        newData,
        status
      };
      return responseObj;
    }

    async getWeatherButton(city) {
     
      const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&exclude=hourly,daily&appid='+process.env.REACT_APP_APPID+'';
      const response = await fetch(weatherUrl, { cache: 'reload' });
      if (!response.ok) {
        throw new Error('Error: ' + response.statusText);
      }
      const data = await response.json();
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const newUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&lang=en&appid='+process.env.REACT_APP_APPID+'';

      const newResponse = await fetch(newUrl, { cache: 'reload' });
      if(!newResponse.ok) {
        throw new Error('Error: ' + newResponse.statusText);
      }
      const newData = await newResponse.json();
      return newData;
    }

}

export default new FetchWeather();
