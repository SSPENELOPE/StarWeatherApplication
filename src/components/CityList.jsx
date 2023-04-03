import React, { useEffect, useState } from "react";
import loadcities from "../utils/loadcities";

function CityList(props) {
    const [showClearBtn, setShowClearBtn] = useState(false);

    useEffect(() => {
        loadcities.loadProfileCities(props);
        const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
        setShowClearBtn(savedCities.length > 0);
    }, []);

    const clear = () => {
        localStorage.removeItem("savedCities");
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
                    <button 
                    onClick={clear}
                    className="btn cust-btn"
                    >Clear Previously Viewed</button>
                )}
            </div>
        </div>
    );
}

export default CityList;