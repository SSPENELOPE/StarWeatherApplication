/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable promise/always-return */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import loadcities from '../utils/loadcities';
import loadSuggestions from '../utils/loadSuggestions';

const DEBOUNCE_DELAY = 300;

function Header(props) {
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [btn, setBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (Auth.loggedIn()) {
      document.location.assign('/Profile');
    } else {
      loadcities.loadSavedCities(props);
    }
  }, []);
  // Call the function to load and display the saved cities when the component mounts

  const handleCityChange = (event) => {
    const { value } = event.target;
    setCity(value.toUpperCase());
    if (value.trim() === '') {
      setCitySuggestions([]);
    }
  };

  const handleSuggestionClick = (value) => {
    setCity(value.name);
    setCitySuggestions([]);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const response = await props.onClick();
    console.log(response);
    if (response.current) {
      localStorage.setItem('currentCity', JSON.stringify(city));
      loadcities.handleCityStorage(props);
      setCity('');
      setCitySuggestions([]);
    }
  };

  useEffect(() => {
    const storedCities = localStorage.getItem('savedCities') || [];
    if (storedCities.length > 0) {
      setBtn(true);
    } else {
      setBtn(false);
    }
  }, []);

  // Memoize the fetchSuggestions function
  const fetchSuggestions = useMemo(
    () => async () => {
      setIsLoading(true);
      console.log('Fetching suggestions...');
      const data = await loadSuggestions.getCachedCitySuggestions();
      const filteredSuggestions = data.filter((suggestion) =>
        suggestion.name.toUpperCase().startsWith(city.toUpperCase())
      );
      setCitySuggestions(filteredSuggestions);
      setIsLoading(false);
    },
    [city]
  );

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



  // clear the previously viewed bar
  const clear = () => {
    localStorage.removeItem('savedCities');
    document.location.reload();
    setBtn(false);
  };

  return (
    // if we ARE logged in
    <header className="custom-header text-center p-3">
      {Auth.loggedIn() ? (
        <div />
      ) : (
        // if we are NOT logged in
        <div>
          <h1 className="text-light font">
            Welcome to <span className="text-uppercase ">Star Weather</span> !
          </h1>
          <section className="d-flex flex-column">
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex flex-column">
                <form onSubmit={handleSearch}>
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder="Find a City"
                    id="city"
                    value={city}
                    className="p-1 m-1 bg-dark text-light"
                    onChange={handleCityChange}
                    aria-autocomplete="list"
                  />
                  <button
                    type="submit"
                    className="m-1 btn cust-btn text-light"
                    id="search"
                  >
                    Search
                  </button>
                </form>
                <div>
                  {citySuggestions.length > 0 && (
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
                  )}
                </div>
              </div>

              <div>
                <Link to="/login" className="btn cust-btn text-light">
                  Login
                </Link>
              </div>
            </div>
            <div className="d-flex flex-row align-items-center ">
              <div>
                <div className="listDiv">
                  <h3 className="my-2 d-flex justify-self-start">
                    Previously Viewed:
                  </h3>
                  <ul className="cities-list mx-3" id="city-list" />
                </div>

                {btn ? (
                  <div className="d-flex justify-self-start">
                    <button
                      id="clear-button"
                      className="my-2 btn cust-btn font clearBtn text-light"
                      onClick={clear}
                    >
                      Clear Previously Viewed
                    </button>
                  </div>
                ) : (
                  <span />
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </header>
  );
}

export default Header;
