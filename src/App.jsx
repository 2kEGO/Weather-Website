import { useState, useEffect } from 'react';
import './App.css';

const apiKey = import.meta.env.VITE_URL; // Replace with your actual API key
const location = 'Berlin'; // Specify the location you want
const dayForecast = 5;
const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${dayForecast}&aqi=yes&alerts=yes`;

function App() {
  const [info, setInfo] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(apiUrl);
        
        const data = await result.json(); // Await JSON parsing
        console.log(data);
        setInfo(data.current);
        setLocation(data.location)

      } catch (error) {
        console.log('error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="body-container">
      
      <div className="weather-container">

        

      </div>
      
    </div>
  );
}

export default App;
