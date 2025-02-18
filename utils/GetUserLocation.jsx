import React, {useState, useEffect} from 'react'

const locationApi = import.meta.env.VITE_GET_LOCATION;

function GetUserLocation(currentCity, setCurrentCity){

    const success = (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude);

        const geoApi = `https://api-bdc.net/data/reverse-geocode-client?latitude=${latitude}longitude=${longitude}&localityLanguage=en`;

        fetch(geoApi)
        .then(res => res.json())
        .then(data => console.log(data.city))
        // setCurrentCity(data.city)

    }

    const error = () => {
        status.textContent = '???'
    }

    navigator.geolocation.getCurrentPosition(success, error);
}
export default GetUserLocation


