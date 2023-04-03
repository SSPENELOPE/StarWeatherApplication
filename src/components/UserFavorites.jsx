import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';


function UserFavorties(props) {
   
    // State variable to manage what to display on the users offCanvas
    const [hasFavorites, setHasFavorites] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Destrucured variables passed from the props
    const { favoriteCities, setFavoriteCities, handleFavoriteFetch } = props.cookieManager;
    const { regularStar, setFavorite } = props.favorite || [];
    const city = props.city

    // Function to handle the deleting a favorite city
    const handleDelete = async (favId, favCity) => {
        const favItemId = `fav-item-${favId}`;
      
        const favItem = document.getElementById(favItemId);
        await fetch(`/api/Favorites/${favId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    // Fade out the column
                    favItem.classList.add("deleteColumn");

                    // This is how we will remove the solidStar from the active city if the user deletes it
                    if(city.toUpperCase().trim() == favCity.toUpperCase().trim()) {
                        setFavorite(regularStar)
                    }
                    // Remove the column from the DOM after the animation is complete
                    setTimeout(() => {
                        const updatedFavorites = favoriteCities.filter(
                            (city) => city.FavId !== favId
                        );
                        setFavoriteCities(updatedFavorites);
                        Cookies.set("favoriteCities", JSON.stringify(updatedFavorites));
                        handleFavoriteFetch();
                    }, 1000);
                    console.log("City Removed");
                } else {
                    throw new Error(`Received ${response.status} ${response.statusText} from server`);
                }
            })
            .catch(error => {
                alert(error + "please try again later")
            })
    }

    // When the canvas is opened we will check to see if the favoriteCities has a length > 0
    useEffect(() => {
        if (favoriteCities.length > 0) {
            setHasFavorites(true);
        } else {
            setHasFavorites(false);
        }
    }, [favoriteCities])

    return (
        <div>
            <div>
                {/* If the favorites DO EXIST we display this */}
                {hasFavorites ? (
                    <div>
                        {/* If the user is editing their favorites we display this */}
                        {editMode ? (
                            <div>
                                <div className="d-flex flex-row justify-content-between m-2 align-items-center">
                                    <h2 className="font"><u>Favortites</u></h2>
                                    <button className="editBtn font" onClick={() => setEditMode(false)}>Done</button>
                                </div>
                                <ul className="d-flex flex-column">
                                    {favoriteCities.map((item) => (
                                        <li key={item.FavId} className="d-flex flex-row justify-content-between" id={`fav-item-${item.FavId}`} >
                                            <button
                                                className="font btn"
                                                onClick={() => props.onClickButton(item.FavCity)}>
                                                {item.FavCity}
                                            </button>
                                            <button className="font btn delete-btn" onClick={() => handleDelete(item.FavId,item.FavCity)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                           
                                        </li>
                                        
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            /* if they ARE NOT editing we show this */
                            <div>
                                <div className="d-flex flex-row justify-content-between m-2 align-items-center">
                                    <h2 className="font"><u>Favortites</u></h2>
                                    <button className="editBtn font" onClick={() => setEditMode(true)}><FontAwesomeIcon icon={faPen} /></button>
                                </div>
                                <ul className="d-flex flex-column">
                                    {favoriteCities.map((item) => (
                                        <button
                                            key={item.FavId}
                                            className="font btn"
                                            onClick={() => props.onClickButton(item.FavCity)}>
                                            {item.FavCity}
                                        </button>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                ) : (
                    /* if they DO NOT have favorites we show this */
                    <div>
                        <h2 className="font">No Favorites Saved</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserFavorties;