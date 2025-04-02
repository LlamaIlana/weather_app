import React, { useState, useEffect } from "react";

function Geolocation({ onUseLocation }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [fetchWeatherData, setFetchWeatherData] = useState(null);
  const [fetchTriggered, setFetchTriggered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  

  // Handle location
  function handleLocation(position) {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }
  // Handle error
  function handleError(error) {
    setError(error.message);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocation, handleError);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // When the button is clicked, pass the location data to the parent
  function handleUseLocation() {
    if (onUseLocation && location) {
      onUseLocation(location);
    }
  }

  // Fetch data with Geolocation data
  useEffect(() => {
    if (location && !fetchTriggered) {
      setFetchTriggered(true); // Trigger the fetch when the location is available
    }
  }, [location]);

  useEffect(() => {
    if (fetchTriggered && location) {
      async function fetchData() {
        try {
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=56a473f9c00a45f4b0173616242211&q=${location.latitude},${location.longitude}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }
          const data = await response.json();
          setFetchWeatherData(data);
        } catch (error) {
          console.log("An error occurred:", error.message);
        }
      }
      fetchData();
    }
  }, [fetchTriggered, location]); 

  return (
    <div>
      <div className="location-container">
      {loading ? (
          <div className="spinner"></div>
        ) : location ? (
          <div>
            <h3>Your Current Location:</h3>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="spinner"></div> 
        )}

      </div>
      <button onClick={handleUseLocation}>Use My Location</button>

      <div className="container">
        {fetchWeatherData ? (
          <div className="container-display">
            <div className="container-display-data">
              <h2>Current Weather in {fetchWeatherData.location.name}:</h2>
              <p>Temperature: {fetchWeatherData.current.temp_c}°C</p>
              <p>Wind Speed: {fetchWeatherData.current.wind_mph} mph</p>
              <p>Humidity: {fetchWeatherData.current.humidity}%</p>
              <p>Wind Gust: {fetchWeatherData.current.gust_kph}kph</p>
            </div>

            <div className="conditions">
              <h3>{fetchWeatherData.current.condition.text}</h3>
              <img
                src={`https:${fetchWeatherData.current?.condition?.icon}`}
                alt={fetchWeatherData.current.condition.text}
                className="weather-icon"
              />
            </div>
          </div>
        ) : error ? (
          <p>Error fetching weather data: {error}</p>
        ) : (
          <div className="spinner"></div>
        )}
      </div>
    </div>
  );
}

export default Geolocation;
