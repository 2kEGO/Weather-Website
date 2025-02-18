import { useState, useEffect } from 'react';
import { format } from "date-fns";
import './App.css';
import './Slide-bar.css';
import GetUserLocation from '../utils/GetUserLocation';


const apiKey = import.meta.env.VITE_URL;
const locationApi = import.meta.env.VITE_GET_LOCATION;

function App() {

  // Get Api data for current/today temp info
  const [currentWeather, setCurrentWeather] = useState(null);

  // Get Api data for current location info
  const [locations, setLocations] = useState(null);

  // Get Api data for 5 day forecast info
  const [forecast, setForecast] = useState(null);
  
  // Default location 
  const [currentLocation, setCurrentLocation] = useState("");

  //User input city 
  const [legitCheck, setLegitCheck] = useState(false)
  

  //Fetch latitude, and longitude data from API url
  const GetUserLocation = () => {

    const success = async (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const geoApi = `https://api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${locationApi}`;
        
        try {
            const res = await fetch(geoApi);
            const data = await res.json();
            console.log(data.locality);
            const result = data.locality;
            setCurrentLocation(result)
            fetchData(result)

        } catch (error) {
            console.error(error);
        }


    }

    const error = () => {
        console.log('Error occurred while fetching location');
    }

    navigator.geolocation.getCurrentPosition(success, error);
  }

  useEffect(() => {
    GetUserLocation();
  },[])

  // Fetch Current, Forecast and Location data from API url
  const fetchData = async (location) => {
    if(!location) return;

    const dayForecast = 5;
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${dayForecast}&aqi=yes&alerts=no`;

    try {
      const result = await fetch(apiUrl);
      const data = await result.json(); // Await JSON parsing
      
      setCurrentWeather(data.current);
      setLocations(data.location);
      setForecast(data.forecast);
    } 
    catch (error) {
      console.log('error:', error);
    }
  };


  // Fetch weather data whenever `currentLocation` changes
  useEffect(() => {
    if (currentLocation) {
      fetchData(currentLocation);
    }
  }, []);

  // Handle input changes
  const handleInputChange = (event) => {
    setCurrentLocation(event.target.value);
  };

  // Handle search on Enter key
  const handleSearch = async () => {
    const location = currentLocation.trim();

    // Check if location is not empty
    if (location === "") {
      setLegitCheck(true);
    }

    // Check if location is valid
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
      const data = await response.json();

      if (data.error) {
        setLegitCheck(true);
        return;
      }
      else{
        fetchData(location)
        setCurrentLocation("")
      }
    }
    catch(err){
      console.error(err);
    }
  };


  // Render data
    if (!currentWeather || !locations || !forecast) {
      return <div>Loading...</div>; // Prevent accessing null properties
    }

  // Get current location today temp
    const todayMinTemp = forecast.forecastday[0].day.mintemp_c;
    const todayMaxTemp = forecast.forecastday[0].day.maxtemp_c;

  // Get current location time
    const localHour = locations.localtime.split(" ")[1];

  // Get current lacation date from location time
    const currentHour = new Date(locations.localtime).getHours();

    // Get hourly(5 hours) forecast for current location
    const hourlyForecast = forecast.forecastday[0].hour.slice(0, 5).map((hour, index) => ({
      time: (currentHour + index) % 24, // Wrap around to 24-hour format
      temp: Math.ceil(hour.temp_c),
      icon: hour.condition.icon,
    }));

    // Get 5 days forecast for current location
    const dailyForecast = forecast.forecastday.map(day => ({
      date: format(new Date(day.date), "EEE"),
      icon: day.day.condition.icon,
      minTemp: Math.floor(day.day.mintemp_c),
      maxTemp: Math.ceil(day.day.maxtemp_c),
    }));

    // Toggle off hamburger menu
   const ToggleOff = () => {
    document.getElementById('sideBar').style.display = 'none';
   }

   // Toggle on hamburger menu
   const ToggleOn = () => {
    document.getElementById('sideBar').style.display = 'flex';
   }

  
  return (
    <div className="body-container">
      
      <div className="weather-container">        

        <div className="hamburger" onClick={ToggleOn}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="side-bar-items" id='sideBar'>

          <div className="x-span-container" onClick={ToggleOff}>
            <div className="x-span">
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="search-bar" >
            <input 
                  type="text"
                  placeholder='City' 
                  value={currentLocation}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch();
                  }}
                  
            />
              
          </div>

          <h4 className={legitCheck? 'show': 'hidden'}>Wrong input</h4>

          {/* <div className="search-bar">
            <button onClick={GetUserLocation}></button>
          </div> */}

          {/* <div className='suggestion'>

            <ul>
              <li></li>
            </ul>
          </div> */}

          

        </div>

        <div className="leftside">


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
              <h3 id='title'>Forecast</h3>

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
