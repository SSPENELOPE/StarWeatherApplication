/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable promise/always-return */
/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import './custom.css';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import {
  faStar as fasFaStar,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons';
import background from './assets/images/background1.jpg';
import Registration from './pages/Registration.jsx';
import Login from './pages/Login.jsx';
import CityList from './components/CityList.jsx';
import CurrentWeather from './components/CurrentWeather.jsx';
import FiveDay from './components/FiveDay.jsx';
import ProfileEditor from './components/ProfileEditor.jsx';
import ProfileHeader from './components/ProfileHeader.jsx';
import UserFavorties from './components/UserFavorites.jsx';
import UserSettings from './components/UserSettings.jsx';
import fetchWeather from './utils/fetchWeather.js';
import suggestions from './utils/suggestions.js';
import Auth from './utils/auth';
import Header from './components/Header';

function Profile() {
  // State to manage if we've loaded cookies
  const [cookiesLoaded, setCookiesLoaded] = useState(false);

  // Ensure we have the right userId and Name, pass the them as props
  const profile: any = Auth.getProfile();
  const userName = profile.unique_name;
  const profileId = profile.userId;

  // This is how we will open and close the offCanvas
  const [show, setShow] = useState(false);

  /* This will check to see if we have a city name stored, if we dont then set the state to empty string */
  const [city, setCity] = useState(() => {
    const currentCity = localStorage.getItem('currentCity');
    return currentCity ? JSON.parse(currentCity) : '';
  });

  /*  This will check to see if the stored weather data exist,
    if it does not we will set state equal to an empty string */
  const [weatherData, setWeatherData] = useState(() => {
    const storedData = localStorage.getItem('weatherData');
    return storedData ? JSON.parse(storedData) : '';
  });

  // State variable for user fvaorites stored in the cookies
  const [favoriteCities, setFavoriteCities] = useState(() => {
    const favoritesCookies = Cookies.get('favoriteCities') || null;
    return favoritesCookies ? JSON.parse(favoritesCookies) : [];
  });

  // We will check to see if the user relogged so we direct them back to where they were if they were editing
  const relogged = localStorage.getItem('relogged');
  const [editProfile, setEditProfile] = useState(() => {
    if (relogged === 'true') {
      return true;
    }
    return false;
  });

  const editor = {
    editProfile,
    setEditProfile,
  };

  // Function to fetch the weather and store it, we will pass this as a prop
  const getWeather = async () => {
    const response = await fetchWeather.getWeather();

    if (response.current) {
      setWeatherData(response);
      setCity(city); // We set this in getWeather function and retrieved in the state variable
      localStorage.setItem('weatherData', JSON.stringify(response));
      return response;
    }
  };

  // Function specifically for the previously viewed or favorites buttons to recall a city search
  const onClickButton = async (city: any) => {
    try {
      const response = await fetchWeather.getWeatherButton(city);
      setWeatherData(response);
      setCity(city);
      localStorage.setItem('weatherData', JSON.stringify(response));
      localStorage.setItem('currentCity', JSON.stringify(city));
      if (show) {
        setShow(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FontAwesome Icons and the state to manage it
  const solidStar = <FontAwesomeIcon icon={fasFaStar} size="2x" />;
  const regularStar = <FontAwesomeIcon icon={farFaStar} size="2x" />;
  const [favorite, setFavorite] = useState(regularStar);

  // We will pass everything we need for the favorite indicator to the currentweather component in an object
  const favoriteItems = {
    solidStar,
    regularStar,
    favorite,
    setFavorite,
    profileId,
  };

  // Function to fetch and store the users's favorites, is also passed as a prop elsewhere
  const handleFavoriteFetch = async () => {
    await fetch(
      `https://starweatherapi.azurewebsites.net//api/Favorites/${profileId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Creating an empty array to store the city names
        const favList: any[] = [];
        if (data === 'No data') {
          setCookiesLoaded(true);
        } else {
          // Looping through the cities and adding them to the "favList" array
          data.forEach((item: any) => {
            favList.push(item);
          });
          // We are going to save it to localstorage so we dont have to keep checking our DB every page render
          const cookieArray = JSON.stringify(favList);
          Cookies.set('favoriteCities', cookieArray);
          setFavoriteCities(favList);
          setCookiesLoaded(true);
        }
      })
      .catch((error) => {
        console.log(`${error}No favorites to fetch`);
      });
  };

  // We will pass this data needed as an object
  const cookieManager = {
    favoriteCities,
    setFavoriteCities,
    handleFavoriteFetch,
  };

  // Run a check against or database and determine if the user has favorited cities
  useEffect(() => {
    // We will again check here to ensure the user is logged in, extra security measure
    if (profileId) {
      handleFavoriteFetch();
      localStorage.setItem('suggestionsOn', 'true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* We could use local storage for the suggestion setting, however we will use cookies because why not,
             I have no other reason to use them at the moment,
              we wont delete these either, this will allow us to reduce api calls to the database */
  const [suggestionsSetting, setSuggestionsSetting] = useState('');

  const suggestionData = {
    suggestionsSetting,
    setSuggestionsSetting,
  };

  // When the user changes setting set it here, by checking if the settings already exit we reduce calls to our server
  useEffect(() => {
    const setting = Cookies.get('suggestionSettings');
    if (setting) {
      setSuggestionsSetting(setting);
    } else {
      suggestions.getSuggestionSettings(profileId);
      console.log('Made a request for settings');
    }
  }, [profileId, suggestionsSetting]);

  return (
    <div>
      {cookiesLoaded ? (
        <div>
          <div>
            {/* Render the header */}
            <ProfileHeader
              onClick={getWeather}
              onClickButton={onClickButton}
              userName={userName}
              suggestionsSetting={suggestionsSetting}
            />

            <div className="d-flex flex-column">
              <div className="sideNav">
                {/* This is how we open the offcanvas */}
                <Button
                  className="btn cust-btn m-2"
                  onClick={() => setShow(true)}
                >
                  &#8592; More Options
                </Button>
                {/* This is the offcanvas with the user's saved information */}
                <Offcanvas show={show} onHide={() => setShow(false)}>
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Make Your Changes</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body className="bg-dark">
                    <div>
                      <button
                        className="btn cust-btn font text-light"
                        onClick={() => {
                          setEditProfile(true);
                          setShow(false);
                        }}
                      >
                        Edit Profile <FontAwesomeIcon icon={faUserPen} />
                      </button>
                      <UserFavorties
                        onClickButton={onClickButton}
                        city={city}
                        favorite={favoriteItems}
                        cookieManager={cookieManager}
                      />
                      <CityList onClickButton={onClickButton} />
                      <UserSettings
                        suggestionData={suggestionData}
                        profileId={profileId}
                      />
                    </div>
                  </Offcanvas.Body>
                </Offcanvas>
              </div>

              <div>
                {editProfile && (
                  <ProfileEditor profile={profile} editor={editor} />
                )}
                {/* Here we will only render the information onto the page if it exist */}
                {weatherData && (
                  <CurrentWeather
                    data={weatherData}
                    city={city}
                    favorite={favoriteItems}
                    cookieManager={cookieManager}
                  />
                )}
                {weatherData && <FiveDay data={weatherData} city={city} />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>loading...</h1>
        </div>
      )}
    </div>
  );
}

function Home() {
  /** ******************* City Handling *************** */
  /* This will check to see if we have a city name stored, if we dont set the state to empty string */
  const [city, setCity] = useState(() => {
    const currentCity = localStorage.getItem('currentCity');
    return currentCity ? JSON.parse(currentCity) : '';
  });

  /* We will pass this as a prop to the header which contains the city search input,
   from there we will update the "city" state and set the local storage for persistency */
  const handleCityChange = (event: { target: { value: string } }) => {
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

  // This is purley fror the previously viewed list, will pass this as a prop
  const onClickButton = async (city: any) => {
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

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <img className="video-1" src={background} alt="background" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </Router>
  );
}
