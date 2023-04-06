/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import React from 'react';
import Cookies from 'js-cookie';
import suggestions from '../utils/suggestions';

function UserSettings(props) {
  const { suggestionsSetting, setSuggestionsSetting } = props.suggestionData;
  const { profileId } = props;
  const turnOnSuggestions = () => {
    const suggestionType = 'On';
    suggestions.setSuggestionSetting(profileId, suggestionType);
    Cookies.set('suggestionSettings', suggestionType);
    setSuggestionsSetting(suggestionType);
  };

  const turnOffSuggestions = () => {
    const suggestionType = 'Off';
    suggestions.setSuggestionSetting(profileId, suggestionType);
    Cookies.set('suggestionSettings', suggestionType);
    setSuggestionsSetting(suggestionType);
  };

  return (
    <div>
      <h2 className="font">
        <u>Settings</u>
      </h2>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row align-items-center">
          <h6 className="font m-0">Suggestions:</h6>
          {suggestionsSetting === 'On' ? (
            <div>
              <button className="btn font text-light">
                <u>
                  <u>
                    <u>On</u>
                  </u>
                </u>
              </button>
              <span className="font">/</span>
              <button
                className="btn font text-light"
                onClick={turnOffSuggestions}
              >
                Off
              </button>
            </div>
          ) : (
            <div>
              <button
                className="btn font text-light"
                onClick={turnOnSuggestions}
              >
                On
              </button>
              <span className="font">/</span>
              <button className="btn font text-light">
                <u>
                  <u>
                    <u>Off</u>
                  </u>
                </u>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
