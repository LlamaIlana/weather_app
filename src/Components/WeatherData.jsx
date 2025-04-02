import React, { useState, useEffect } from "react";

function WeatherData() {
  const [fetchWeatherData, setFetchWeatherData] = useState(null);
  const [inputData, setInputData] = useState("");
  const [fetchTriggered, setFetchTriggered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to reset input
  const resetInput = () => {
    setInputData("");
    setFetchWeatherData(null);
    setFetchTriggered(false);
  };

  // Function to handle key press (Corrected)
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  // Function to handle search action
  function handleSearch() {
    if (inputData.trim() !== "") {
      setLoading(true);
      setFetchTriggered(true);
    }
  }

  useEffect(() => {
    if (fetchTriggered === true) {
      async function fetchData() {
        try {
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=56a473f9c00a45f4b0173616242211&q=${inputData}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }
          const data = await response.json();
          setFetchWeatherData(data);
        } catch (error) {
          console.log("An error occurred:", error.message);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [inputData, fetchTriggered]);

  return (
    <div className="container">
      <div className="container-search">
        <label htmlFor="weatherdata">What City are you Looking For?</label>
        <input
          onChange={(event) => setInputData(event.target.value)}
          id="weatherdata"
          placeholder="Enter City Name Here"
          value={inputData}
          onKeyDown={handleKeyPress} // Listen for the Enter key press
        />

        <button onClick={() => setFetchTriggered(true)}>Search</button>
        <button onClick={resetInput}>Reset</button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : fetchWeatherData ? (
        <div className="container-display">
          <h2>Current Weather in {fetchWeatherData.location.name}:</h2>
          <p>Temperature: {fetchWeatherData.current.temp_c}°C</p>
          <p>Wind Speed: {fetchWeatherData.current.wind_mph} mph</p>
          <p>Humidity: {fetchWeatherData.current.humidity}%</p>
          <p>Wind Gust: {fetchWeatherData.current.gust_kph}kph</p>

          <div className="condtions">
            <h3>{fetchWeatherData.current.condition.text}</h3>
            <img
              src={`https:${fetchWeatherData.current?.condition?.icon}`}
              alt={fetchWeatherData.current.condition.text}
              className="weather-icon"
            />
          </div>
        </div>
      ) : fetchTriggered && !loading ? (
        <p>Data not available...</p>
      ) : null}
    </div>
  );
}

export default WeatherData;
