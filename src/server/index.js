const dotenv = require('dotenv');
dotenv.config();
//const path = require('path')
const fetch = require('node-fetch');
const mockAPIResponse = require('./mockAPI.js')
//URL and API Key for WeatherBit
const weatherbitBaseURL = "https://api.weatherbit.io/v2.0/current?city=";
const weatherbitAPIKey = process.env.WEATHERBIT_API_KEY;
//URL and API Key for Pixabay
const pixabayURL = "https://pixabay.com/api/";
const pixabayAPIKey = process.env.PIXABAY_API_KEY;
// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
const bodyParser = require('body-parser')
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
var cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('./dist'));

app.get('/', function (req, res) {
  // res.sendFile('dist/index.html')
  res.sendFile('./dist/index.html')
})
// Setup Server
const port = 8090;
app.listen(port, ()=>{console.log(`running on port 8090`)})

/*app.get('/test', function (req, res) {
  res.send(mockAPIResponse)
})*/

const travelData = [];
app.get('/list', function (req, res) {
    res.send(travelData);
})

//Add travel data.
app.post('/add', function (req, res) {
  let data = {};

  data.location = req.body.location;
  data.countryName = req.body.countryName;
  data.latitude = req.body.latitude;
  data.longitude = req.body.longitude;
  data.population = req.body.population;
  data.goDate = req.body.goDate;
  data.duration = req.body.duration;

  const weatherPromise = new Promise((resolve, reject) => {
      weatherbit(data.location).then(function (response) {
       
          resolve(response);
      });
  });
  const imagePromise = new Promise((resolve, reject) => {
    pixabay(data.location).then(function (response) {

        resolve(response);
    });
  
  });
  const RestPromise = new Promise((resolve, reject) => {
    RestCountriesApi(data.countryName).then(function (response) {

        resolve(response);
    });
  });

   Promise.all([weatherPromise, imagePromise, RestPromise]).then(function (results) {

      const weatherData = results[0];
      const imageData = results[1];
      const RestData = results[2];

      if(weatherData.status == 404){
        data.sunrise = 'undefined';
        data.sunset = 'undefined';
        data.pres = 'undefined';
        data.temp = 'undefined';
        data.description = 'undefined';
      }
      else{
        data.sunrise = weatherData.data[0].sunrise;
        data.sunset = weatherData.data[0].sunset;
        data.pres = weatherData.data[0].pres;
        data.temp = weatherData.data[0].temp;
        data.description = weatherData.data[0].weather.description;
      }
      
      if(RestData.status == 404){
        data.region = 'undefined';
        data.subregion = 'undefined';
        data.currenciesName = 'undefined';
        data.language = 'undefined';
        data.capital = 'undefined'
      }
      else{
        data.region = RestData[0].region;
        data.subregion = RestData[0].subregion;;
        data.currenciesName = RestData[0].currencies[0].name;
        data.language = RestData[0].languages[0].name;
        data.capital = RestData[0].capital;
      }

      if(imageData.totalHits > 0) {
          data.imageUrl = imageData.hits[0].webformatURL;
      } else {
          data.imageUrl = '';
      }

      travelData.push(data);
      console.log(travelData);

      res.send({
          messsage: "add travel data successfully.",
          success: true
      });
  });

});

// Delete travle data
app.post('/delete', function (req, res) {
  let currentIndex = req.body.currentIndex;

  travelData.splice(currentIndex, 1);
  res.send({
      messsage: "delete travel data successfully.",
      success: true
  });
})

// for Weatherbit api
const weatherbit = async (city) => {

  const requestURL = `${weatherbitBaseURL}${city}&key=${weatherbitAPIKey}`;
  const response = await fetch(requestURL);
  let result = {};
  try {
      result = await response.json();

  } catch (error) {
      console.log('error:', error);
  };
  return result;
}

// for Pixabay api
const pixabay = async (location) => {
  const requestURL = `${pixabayURL}?key=${pixabayAPIKey}&q=${location}&image_type=photo`;
  const response = await fetch(requestURL);
  let result = {};
  try {

      result = await response.json();

  } catch (error) {
      console.log('error:', error);
  };
  return result;
}

// for REST Countries API
const RestCountriesApi = async (country) => {
  const requestURL = `https://restcountries.eu/rest/v2/name/${country}?fullText=true`;//encodeURIComponent(location) + '&image_type=photo'
  const response = await fetch(requestURL);
  let result = {};
  try {

      result = await response.json();

  } catch (error) {
      console.log('error:', error);
  };
  return result;
}