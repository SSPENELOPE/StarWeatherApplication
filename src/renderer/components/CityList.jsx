/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable promise/always-return */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import loadcities from '../utils/loadcities';

function CityList(props) {
  const [showClearBtn, setShowClearBtn] = useState(false);

  useEffect(() => {
    loadcities.loadProfileCities(props);
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    setShowClearBtn(savedCities.length > 0);
  }, []);

  const clear = () => {
    localStorage.removeItem('savedCities');
    setShowClearBtn(false);
    document.location.reload();
  };

  return (
    <div>
      <div>
        {showClearBtn && (
          <h2 className="font justify-self-start">
            <u>Previously Searched</u>
          </h2>
        )}
        <ul id="profileCityList" className="offCanvasSearched">
          {/* Previously Searched Cities Will Appear Here */}
        </ul>
        {showClearBtn && (
          <div className="d-flex flex-row align-items-center">
            <h6 className="text-light mx-2">Clear Previously Viewed &rarr;</h6>
            <button onClick={clear} className="btn cust-btn text-light mx-2">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CityList;
