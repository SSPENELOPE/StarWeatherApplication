class LoadCities {

    // Define a function that loads the saved cities from local storage and displays them
    loadSavedCities(props) {
        // React likes to render things twice, so we can check here to see if its already been rendered, if it has, exit the function so we dont render it twice!
        let cityList = document.getElementById("city-list");
        if (cityList.children.length > 0) return; // return early if cities already loaded

        // Else check storage and add the items
        let storageArray = JSON.parse(localStorage.getItem('savedCities')) || [];
        storageArray.forEach((cityNames) => {
            const cityList = document.getElementById("city-list");
            const cities = document.createElement("button");
            cities.classList = "bg-transparent text-center cities m-3";
            cities.textContent = cityNames;
            cities.addEventListener("click", () => props.onClickButton(cityNames));
            cityList.appendChild(cities);
        });
    };

    handleCityStorage(props) {
        const cityInput = document.getElementById("city");
        const city = cityInput.value.trim().toUpperCase();
        let storageArray = JSON.parse(localStorage.getItem('savedCities')) || [];
        const cityList = document.getElementById("city-list");

        // Check if city already exists in storageArray
        const cityExists = storageArray.includes(city);

        const cities = document.createElement("button");
        cities.classList = "bg-transparent text-center cities m-3";
        cities.textContent = city;
        cities.addEventListener("click", props.onClickButton(city));

        // If city doesn't exist in storageArray, append it to the list and add it to the storageArray
        if (!cityExists && storageArray.length < 5) {
            cityList.appendChild(cities);
            storageArray.push(city);
            localStorage.setItem("savedCities", JSON.stringify(storageArray));
          } else if (!cityExists && storageArray.length >= 5) {
            // If city doesn't exist in storageArray and the length is 5 or more, remove the first city and add the new city
            storageArray.shift();
            cityList.removeChild(cityList.firstChild);
            cityList.appendChild(cities);
            storageArray.push(city);
            localStorage.setItem("savedCities", JSON.stringify(storageArray));
          }
    }

    profileCityStorage() {
        const cityInput = document.getElementById("profCity");
        const city = cityInput.value.trim().toUpperCase();
        let storageArray = JSON.parse(localStorage.getItem('savedCities')) || [];

        // Check if city already exists in storageArray
        const cityExists = storageArray.includes(city);

        // If city doesn't exist in storageArray, append it to the list and add it to the storageArray
        if (!cityExists && storageArray.length < 5) {
            storageArray.push(city);
            localStorage.setItem("savedCities", JSON.stringify(storageArray));
          } else if (!cityExists && storageArray.length >= 5) {
            storageArray.shift();
            storageArray.push(city);
            localStorage.setItem("savedCities", JSON.stringify(storageArray));
          }
    }

    loadProfileCities(props) {
          // React likes to render things twice, so we can check here to see if its already been rendered, if it has, exit the function so we dont render it twice!
          let cityList = document.getElementById("profileCityList");
          if(!cityList) return;
          if (cityList.children.length > 0) return; // return early if cities already loaded
  
          // Else check storage and add the items
          let storageArray = JSON.parse(localStorage.getItem('savedCities')) || [];
          storageArray.forEach((cityNames) => {
              var cityList = document.getElementById("profileCityList");
              var cities = document.createElement("button");
              cities.classList = "offCanvasButton";
              cities.textContent = cityNames;
              cities.addEventListener("click", () => props.onClickButton(cityNames));
              cityList.appendChild(cities);
          });
    }
}

export default new LoadCities();