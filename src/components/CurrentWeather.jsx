import React, { useState, useEffect } from "react";
import HourlyWeather from "./HourlyWeather";
import Checkmark from "./Checkmark";


function CurrentWeather(props) {
    // Our state variables to manage showing the checkmark
    const [isChecked, setIsChecked] = useState(false);
    const [showCheckmark, setShowCheckmark] = useState(false);

    // Our state variables to manage the page
    const [saveState, setSaveState] = useState({ UserId: '', FavCity: '' })
    const { favoriteCities, setFavoriteCities, handleFavoriteFetch } = props.cookieManager || [];

    // Destructer the items needed for saving user's favorites
    const { profileId, solidStar, regularStar, favorite, setFavorite } = props.favorite || [];

    // If it is a fresh search we will take the data passed as a prop, if the page is refreshed we will go to local storage to ensure the data persist on the page... I may end up moving some items to the indexedDB later on
    const current = JSON.parse(localStorage.getItem("weatherData")).current;
    const hourly = JSON.parse(localStorage.getItem("weatherData")).hourly;
    const city = JSON.parse(localStorage.getItem("currentCity"));

    // Create a new array we can store only the FavCity name in
    const newList = []
    // Ensure the user is logged in before doing attempting to separate them
    if (profileId) {
        favoriteCities.forEach((item) => { // We added a protection measure for this in parent component
            newList.push(item.FavCity.toUpperCase().trim());
        });
    }

    // Run a check against the cookies and determine whether the city is a favorite or not, we will also update or savedState according to our dependancies
    useEffect(() => {
        /* We only want to run this if the user is logged in. We do this by checking if the profileId exist
        followed by checking if our list includes the city name */
        if (profileId) {
            setSaveState({
                UserId: profileId,
                FavCity: city,
            });

            if (newList.includes(city.toUpperCase().trim())) {
                setFavorite(solidStar);
            } else {
                setFavorite(regularStar);
            }
        }
    }, [city, profileId]);

    const checkmarkHandler = () => {
        setIsChecked(!isChecked);
        setShowCheckmark(true);
        setTimeout(() => setShowCheckmark(false), 2000);
    }

    // This is our handling function for when a user clicks the favorite "star" indicator
    const favoriteHandler = async () => {
        // If our list does NOT include the city name, execute the following
        if (!newList.includes(city.toUpperCase().trim())) {
            setFavorite(solidStar); // Update the star to solid
          
            // Make the fetch request
            const res = await fetch('/api/Favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveState),
            });
            // Add measures to ensure the API call was executed properly
            if (res.ok) {
                handleFavoriteFetch(); // Recall the cookies/update state
                checkmarkHandler(); // Show the user it worked with checkmark
            } else {
                alert('Sorry there was an error, try again later');
            }
            // otherwise do nothing
        } else {
            return;
        }
    };

 



    return (
        <div className="currentWrapper">
            <h1 className="display-3 city-title">
                <u>{city}</u>
                {/* If the user is logged in we will allow them to save a favorite city */}
                {profileId && (
                    <button className="btn neon mx-3" onClick={favoriteHandler}>
                        {favorite}
                        {showCheckmark && <Checkmark />}
                    </button>
                )}
            </h1>
            <div className="current">

                <div className="d-flex flex-column currentBox">
                    <h1 className="text-center font bg-dark">Your Current Weather</h1>
                    <ul className="font data-list">
                        <div className="stat-group">
                            <h2 className="font"><u>Current Temprature</u></h2>
                            <li className="data">{Math.round(current.temp)}<span>&#8457;</span></li>
                        </div>
                        <div className="stat-group">
                            <h2 className="font"><u>Feels Like</u></h2>
                            <li className="data">{Math.round(current.feels_like)}<span>&#8457;</span></li>
                        </div>
                        <div className="stat-group">
                            <h2 className="font"><u>Humidity</u></h2>
                            <li className="data">{current.humidity}%</li>
                        </div>
                        <div className="stat-group">
                            <h2 className="font"><u>UV-Index</u></h2>
                            <li className="data">{current.uvi}</li>
                        </div>
                        <div className="stat-group">
                            <h2 className="font"><u>Clouds</u></h2>
                            <li className="data">{current.clouds}% Cloud Coverage</li>
                        </div>        
                    </ul>
                </div>

                <div className="d-flex flex-column hourlyBox">
                    <HourlyWeather hourly={hourly} />
                </div>
            </div>
        </div>
    )
}

export default CurrentWeather;