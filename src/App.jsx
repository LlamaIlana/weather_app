import React, { useState } from "react";
import Geolocation from "./Components/Geolocation";
import WeatherData from "./Components/WeatherData";

function App() {
  const [showGeolocation, setShowGeolocation] = useState(false);

  // Function to handle button click and show the Geolocation component
  function handleUseCurrentLocation() {
    setShowGeolocation(true);
  }

  // Function to handle button click and go back to WeatherData component
  function backToSearch() {
    setShowGeolocation(false); // Go back to WeatherData
  }

  return (
    <div className="app-container">
      {showGeolocation ? (
        <div>
          <Geolocation />
          <button className="search-button" onClick={backToSearch}>
            Search By City
          </button>
        </div>
      ) : (
        <div className="weather-container">
          <button className="location-button" onClick={handleUseCurrentLocation}>
            Use Current Location
          </button>
          <WeatherData />
        </div>
      )}
    </div>
  );
}

export default App;
