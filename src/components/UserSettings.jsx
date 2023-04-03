import React from "react";
import suggestions from "../utils/suggestions";
import Cookies from "js-cookie";

function UserSettings(props) {
    const { suggestionsSetting, setSuggestionsSetting } = props.suggestionData;
    const profileId = props.profileId;
    console.log(suggestionsSetting)
    const turnOnSuggestions = () => {
        const suggestionType = "On";
        suggestions.setSuggestionSetting(profileId, suggestionType);
        Cookies.set("suggestionSettings", suggestionType);
        setSuggestionsSetting(suggestionType);
    }

    const turnOffSuggestions = () => {
        const suggestionType = "Off";
        suggestions.setSuggestionSetting(profileId, suggestionType);
        Cookies.set("suggestionSettings", suggestionType);
        setSuggestionsSetting(suggestionType);
    }


    return (
        <div>
            <h2 className="font"><u>Settings</u></h2>
            <div className="d-flex flex-column">
                <div className="d-flex flex-row align-items-center">
                    <h6 className="font m-0">Suggestions:</h6>
                    {suggestionsSetting === "On" ? (
                        <div>
                            <button className="btn font"><u><u><u>On</u></u></u></button>
                            <span className="font">/</span>
                            <button className="btn font" onClick={turnOffSuggestions}>Off</button>
                        </div>
                    ) : (
                        <div>
                            <button className="btn font" onClick={turnOnSuggestions}>On</button>
                            <span className="font">/</span>
                            <button className="btn font"><u><u><u>Off</u></u></u></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserSettings;