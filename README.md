#Travel App Project

## Run the application
1. **Pre-requisite** : 
Install [node.js](https://nodejs.org/)

2. unzip the projects folder.

3. install the dependencies
```
npm install
```
4. Run build for the project using the cmd as follow:
```
npm run build-prod
```

5. Run the server.
```
npm start
```

6. View the URL **http://localhost:8090/** in browser.
7. Run the testing.
```
npm run test.
```

## In application.js
// I use generateContent function for generate html content
// I use getTravelList for get data from the server
// I use getGeonamesData for get Geonames Data from api geonames
// I use postData for take data that we want from apis

## In deleteHandleSubmit.js
//I use removeTrip function for remove trip

## In server.js
// I use Weatherbit function for using Weatherbit api
// I use pixabay function for using Pixabay api
// I use RestCountriesApi function for using REST Countries API