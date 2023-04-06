/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable promise/always-return */
import React from 'react';

function FiveDay(props) {
  const forecast = props.data.daily.slice(0, 5);

  return (
    <div className="fiveDayWrapper">
      <h1 className="display-5 font text-end">
        <u>Your 5 day forecast</u>
      </h1>
      <div className="neon-row">
        {forecast.map((item, index) => (
          <div key={index} className="card bg-transparent neon-card my-2 mx-2">
            <ul className="list-group bg-dark list-group-flush test bg-transparent">
              <li className="list-group-item bg-transparent neon text-light">
                {new Date(item.dt * 1000).toLocaleString('en-US', {
                  weekday: 'long',
                })}
              </li>
              <li className="list-group-item bg-transparent neon text-light">
                {item.weather[0].description}
                <img
                  src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                  alt="icon"
                />
              </li>
              <li className="list-group-item bg-transparent neon text-light">
                Temp High: {Math.round(item.temp.max)}
                <span>&#8457;</span>
              </li>
              <li className="list-group-item bg-transparent neon text-light">
                Sunrise{' '}
                {new Date(item.sunrise * 1000).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </li>
              <li className="list-group-item bg-transparent neon text-light">
                Sunset{' '}
                {new Date(item.sunset * 1000).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FiveDay;
