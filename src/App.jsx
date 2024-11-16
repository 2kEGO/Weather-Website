import { useState, useEffect } from 'react';
import { format } from "date-fns";
import './App.css';


const apiKey = import.meta.env.VITE_URL; // Replace with your actual API key
const location = 'Toronto'; // Specify the location you want
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
      minTemp: day.day.mintemp_c,
      maxTemp: day.day.maxtemp_c,
    }));


    


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
              <h1>{locations.name}, {locations.country}</h1>
            </div>

            <div className="time">

              <h2>{localHour}</h2>
              <hr />
              <h2>H:{todayMaxTemp}</h2>           
              <h2>L:{todayMinTemp}</h2>           
            
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
                  time={index === 0 ? "Now" : `${forecast.time}:00`}
                  temp={forecast.temp}
                  icon={forecast.icon}
                />
              ))}
            </div>

            

          </div>

          <div className='forecast-display'>
              <h4>5-Day Forecast</h4>
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

  

  function ForecastWeather({date, icon, minTemp, maxTemp}) {
    return <div className='forecast-weather'>

      <h4 id="foreCast-date">{date}</h4>
      <img src={icon} alt="" id="forecast-icon" />
      <h4 id="forecast-minTemp">{minTemp}°C</h4>
      <span></span>
      <h4 id="forecast-maxTemp">{maxTemp}°C</h4>
    </div>;
  }
}


function CurrWeather({time, icon, temp}) {
  return <div className="weather-item">

    <h4>{time}</h4>
    <img src={icon} alt="" />
    <h4>{temp}</h4>

  </div>;
}
export default App;
