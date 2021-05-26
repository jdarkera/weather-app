import { useState, useEffect} from 'react';
import './App.css'; 
import countries from 'i18n-iso-countries';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTemperatureLow, faTemperatureHigh, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

function App() {
  //state 
//  apiData state to store the response
// getState to store the location name from input field
// state to store a copy of the getState - this will be helpful in updating state on button click.
// can ignore this state and directly pass getState on the URL as well.
  const [apiData, setApiData] = useState({});
  const [getState, setGetState] = useState('Irvine, USA');
  const [state, setState] = useState('Irvine, USA');

  //API key and URL
// apiKey to store the API key created earlier in the .env file.
// apiURL to store the URL that calls the location from getState and also apiKey.

  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid=${apiKey}`;

//side effects
//make an api request using Ajax fetch method and also the useEffect
// Hook. useEffect hook is used to perform side effects on your app. This lifecycle hook
// from react class components is an alternative to componentDidMount, unmount, etc
useEffect (() => {
  fetch(apiUrl)
  .then((res) => res.json())
  .then((data) => setApiData(data));
}, [apiUrl]);
//inputHandler: this function is to handle the input field, to get the data and store in getState.
const inputHandler = (event) => {
  setGetState(event.target.value);
};
// submitHandler: this function is to copy the state from getState to state.
const submitHandler = () => {
  setState(getState);
};
//kelvinToFarenheit: this function is to convert kelvin to celcius to farenheit with no decimals, and since we get the data from api as kelvin, we’ll need to use this function to convert.
const kelvintoFarenheit = (k) => {
   return ((k - 273.15)* 1.8 +32).toFixed(0);
 };
  return (
    <div className="container">
      <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
        <div className="col-auto">
          <label for="location-name" class="col-form-label">
            Enter location:
          </label>
        </div>
        <div className="col-auto">
          <input 
          type="text"
          id="location-name"
          class="form-control"
          onChange={inputHandler}
          value={getState}
          />
        </div>
        <button 
            className="btn btn-primary mt-2"
            onClick={submitHandler}
            >
              Search
            </button>
      </div>
      {/* apiData.main attempts to extract weather data from open weather in the main category: https://openweathermap.org/current */}
      <div className="card mt-3 mx-auto">
      {/* If there’s data coming in, we want data to be displayed. Here’s the first batch of data we
want to display – a status weather icon, current temp and location: */}
        {apiData.main 
        ? (<div className = "card-body text-center">
          <img 
              src={ `http://openweathermap.org/img/w/${apiData.weather[0].icon}.png`}
              alt="weather status icon"
              className="weather-icon"
              />
              <p className="h2">
                {kelvintoFarenheit(apiData.main.temp)}&deg; F
              </p>
              <p className="h5">
                <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="fas fa-1x mr-2 text-dark"
                />{' '}
                <strong>{apiData.name}</strong>
              </p>
        
          <div className="row mt-4">
            <div className="col-md-6">
         {/* low temperature  */}
          <p>
                <FontAwesomeIcon 
                    icon={faTemperatureLow}
                    className="fas fa-1x mr-2 text-primary"
              />{' '}
            <strong>
                {kelvintoFarenheit(apiData.main.temp_min)}&deg; F
            </strong>
          </p>
          {/* high temperature  */}
          <p>
                <FontAwesomeIcon 
                    icon={faTemperatureHigh}
                    className="fas fa-1x mr-2 text-danger"
              />{' '}
            <strong>
                {kelvintoFarenheit(apiData.main.temp_max)}&deg; F
            </strong>
          </p>
          </div>
    <div className="col-md-6">  
        <p>
          {' '}
          <strong>{apiData.weather[0].main}</strong>
        </p>
        <p>
            <strong>
              {' '}
              {countries.getName(apiData.sys.country, 'en', {
                select: 'official',
              })}
            </strong>
        </p>
    </div>
          </div>
        </div>) /* Load data if true */
        : (<h1>Loading...</h1>)}
      </div>
    <footer className="footer">
    </footer>
    </div> 
  )
}
export default App;
