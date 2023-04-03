import React from "react";

function HourlyWeather(props) {
    /* Take the only 7 hours worth of data */    
    const hourly = props.hourly.slice(0, 7);

    return (
        <div className="d-flex flex-column align-items-center hourly">
            <h3 className="font">Your Hourly Weather</h3>
            {hourly.map((item, Index) => (
                <div key={Index} className="table-rows">
                    <h6 className="font table-cell">
                        {new Date(item.dt * 1000).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true
                        })}
                    </h6>
                    <h6 className="font table-cell">{Math.round(item.temp)}<span>&#8457;</span></h6>
                    <h6 className="font table-cell">
                        {item.weather[0].description} 
                        <img src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`} />
                    </h6>
                </div>
            ))}
        </div>
    )
}

export default HourlyWeather;