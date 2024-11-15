import { useState, useEffect } from 'react';
import './App.css';

const apiKey = import.meta.env.VITE_URL; // Replace with your actual API key
const location = 'Berlin'; // Specify the location you want
const dayForecast = 5;
const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${dayForecast}&aqi=yes&alerts=no`;



function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [locations, setLocations] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(apiUrl);
        
        const data = await result.json(); // Await JSON parsing
        console.log(data);
        setCurrentWeather(data.current);
        setLocations(data.location);
        setForecast(data.forecast);
        

      } catch (error) {
        console.log('error:', error);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="body-container">
      
      <div className="weather-container">

        <div className="leftside">

          <div className="search-bar">
            <input type="text" placeholder='City' />
          </div>

          <div className="current-weather">

            <div className="temp">

              <h1>{currentWeather.temp_c}</h1>
              <img src={currentWeather.condition.icon} alt="" />

            </div>

            <div className="location">
              <h1>{locations.name}</h1>
            </div>

            <div className="time">

              <h2>{locations.localtime}</h2>
              <hr />
              <h2>H:{forecast}</h2>           
              <h2>L:{todayMin}</h2>           
            
            </div>

          </div>

        </div>

        <div className="rightside"></div>

      </div>
      
    </div>
  );
}

export default App;
