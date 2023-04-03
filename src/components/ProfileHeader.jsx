import React, { useMemo, useState, useEffect, useRef } from "react";
import Auth from "../utils/auth";
import loadcities from "../utils/loadcities";
import loadSuggestions from "../utils/loadSuggestions"

function ProfileHeader(props) {
  
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef(null);
  const DEBOUNCE_DELAY = 300;

  const suggestionsSetting = props.suggestionsSetting;

  // On page load we will pre cache the user's local storage with the citie names from out large JSON file
  useEffect(() => {
    loadSuggestions.cacheCitySuggestions();
  }, []);
  
  // Function to update the state of the city name as the user is typing 
  const handleCityChange = (event) => {
    const value = event.target.value;
    setCity(value.toUpperCase());
    if (value === "") {
      setCitySuggestions([]);
    }
  };

  // Search handler, clears states and sets storage when the user submits the search
  const handleSearch = async (event) => {
    event.preventDefault();

    const responseStatus = await props.onClick();
    if(responseStatus === 200) {
        localStorage.setItem("currentCity", JSON.stringify(city));
        setCity("");
        setCitySuggestions([]);
        loadcities.profileCityStorage(props);
    } else {
      return;
    }
  };

  // Function to handle what happens when the user clicks a suggestion
  const handleSuggestionClick = (value) => {
    setCity(value.name);
    setCitySuggestions([]);
  };


  // Memoize the fetchSuggestions function
  const fetchSuggestions = useMemo(() => async () => {
    setIsLoading(true);
    console.log('Fetching suggestions...');
    const data = await loadSuggestions.getCachedCitySuggestions();
    const filteredSuggestions = data.filter((suggestion) => suggestion.name.toUpperCase().startsWith(city.toUpperCase()));
    setCitySuggestions(filteredSuggestions);
    setIsLoading(false);
  }, [city]);


  // Debounce the fetchSuggestions function, this helps for fast typers we will only render data once the user has paused typing in the input
  useEffect(() => {
    if (city) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions();
      }, DEBOUNCE_DELAY);
    }
    return () => clearTimeout(debounceTimerRef.current);
  }, [city, fetchSuggestions]);

  


  return (
    <div className="jumbotron jumbotron-fluid custom-border">
      <div className="container">
        <h1 className="display-4 font"><u>Welcome {props.userName}</u></h1>
        <p className="lead font">To your personal weather dashboard</p>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <form
            className="d-flex flex-row"
            onSubmit={handleSearch}
          >
            <div className="d-flex flex-column position-relative">
              <div className="row">
                <div className="col">
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder="Find a City"
                    id="profCity"
                    value={city}
                    className="p-1 m-1 bg-dark text-light"
                    onChange={handleCityChange}
                    aria-autocomplete="list"
                  ></input>
                </div>
                <div className="col-auto">
                  <button
                    type="submit"
                    className="m-1 bg-primary rounded custom-button"
                    id="search"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
              {isLoading ? (
                <div className="suggestions-container">
                  <div>
                    <span>Loading...</span>
                  </div>
                  <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : (
             suggestionsSetting === "On" &&  citySuggestions.length > 0 && (
                  <div className="suggestions-container-notLogged">
                    <ul className="suggestions">
                      {citySuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </form>
        </div>
        <button className="btn cust-btn mx-1" onClick={() => Auth.logout()}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;