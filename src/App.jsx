import { useState, useEffect } from 'react';
import { format } from "date-fns";
import './App.css';


const apiKey = import.meta.env.VITE_URL; // Replace with your actual API key


function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [locations, setLocations] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("Toronto");

  const fetchData = async (location) => {
    const dayForecast = 5;
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${dayForecast}&aqi=yes&alerts=no`;

    try {
      const result = await fetch(apiUrl);
      const data = await result.json(); // Await JSON parsing
      console.log(data);
      setCurrentWeather(data.current);
      setLocations(data.location);
      setForecast(data.forecast);
    } 
    catch (error) {
      console.log('error:', error);
    }
  };

  const fetchSearch = async (location) => {

    fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${location}`)
      .then(res => res.json())
      .then(data => console.log(data))
  };

  // Fetch data for the default location on component mount
  useEffect(() => {
    fetchData(currentLocation);
    fetchSearch(currentLocation);
  }, []);

  // Handle input changes
  const handleInputChange = (event) => {
    setCurrentLocation(event.target.value);
  };

  // Handle search on Enter key or button click
  const handleSearch = () => {
    if (currentLocation.trim() !== "") {
      fetchData(currentLocation);
    }
  };

    if (!currentWeather || !locations || !forecast) {
      return <div>Loading...</div>; // Prevent accessing null properties
    }

    const todayMinTemp = forecast.forecastday[0].day.mintemp_c;
    const todayMaxTemp = forecast.forecastday[0].day.maxtemp_c;
    const localHour = locations.localtime.split(" ")[1];

    const currentHour = new Date(locations.localtime).getHours();
    const hourlyForecast = forecast.forecastday[0].hour.slice(0, 5).map((hour, index) => ({
      time: (currentHour + index) % 24, // Wrap around to 24-hour format
      temp: Math.ceil(hour.temp_c),
      icon: hour.condition.icon,
    }));

    const dailyForecast = forecast.forecastday.map(day => ({
      date: format(new Date(day.date), "EEE"),
      icon: day.day.condition.icon,
      minTemp: Math.floor(day.day.mintemp_c),
      maxTemp: Math.ceil(day.day.maxtemp_c),
    }));


    


  return (
    <div className="body-container">
      
      <div className="weather-container">


        <div className="leftside">

          <div className="search-bar">
            <input type="text"
                   placeholder='City' 
                   value={currentLocation}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch();
                  }}/>
          </div>

          <div className="current-weather">

            <div className="temp">

              <div id='temp-wrap'>
                <h1>{Math.floor(currentWeather.temp_c)}</h1>
                <h2>°C</h2>
              </div>
              

              <img src={currentWeather.condition.icon} alt="" />

            </div>

            <div className="location">
              <h1>{locations.name}, {locations.country}</h1>
            </div>

            <div className="time">

              <h2>{localHour}</h2>
              <hr />
              <h2>H: {Math.ceil(todayMaxTemp)}°</h2>           
              <h2>L: {Math.floor(todayMinTemp)}°</h2>           
            
            </div>

          </div>

        </div>

        <div className="rightside">

          <div className="current-weather-container">
            
            <div className="title">
              <h3>{forecast.forecastday[0].day.condition.text}</h3>
            </div>

            <hr />

            <div className="weather-display">
              {hourlyForecast.map((forecast, index) => (
                <CurrWeather
                  key={index}
                  time={index === 0 ? "Now" : `${forecast.time}`}
                  temp={forecast.temp}
                  icon={forecast.icon}
                />
              ))}
            </div>

            

          </div>

          <div className='forecast-display'>
              <h3 id='title'>5-Day Forecast</h3>

              <hr />

              <div className='forecast-container'>

                {dailyForecast.map((forecast, index) => (
                  <ForecastWeather
                    key={index}
                    date={index === 0 ? "Today" : forecast.date}
                    icon={forecast.icon}
                    minTemp={forecast.minTemp}
                    maxTemp={forecast.maxTemp}
                   />
                ))}
                  

              </div>
          </div>

        </div>

      </div>
      
    </div>
  );

  

  
}


function CurrWeather({time, icon, temp}) {
  return <div className="weather-item">

    <h4>{time}</h4>
    <img src={icon} alt="" />
    <div className='degree'>
      <h4>{temp}</h4>
      <h5>°C</h5>
    </div>
    

  </div>;
}
function ForecastWeather({date, icon, minTemp, maxTemp}) {
  return <div className='forecast-weather'>

    <h4 id="foreCast-date">{date}</h4>
    <img src={icon} alt="" id="forecast-icon" />
    <div className='degree'>
      <h5 id="forecast-minTemp">{minTemp}</h5>
      <h5>°C</h5>
    </div>
    
    <span></span>

    <div className='degree'>
      <h5 id="forecast-maxTemp">{maxTemp}</h5>
      <h5>°C</h5>
    </div>
    
  </div>;
}
export default App;
