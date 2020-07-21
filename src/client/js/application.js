const apiURL = 'http://localhost:8090';
//URL and API Key for geonames
const geonamesBaseURL = 'https://secure.geonames.org/searchJSON?formatted=true&q=';
const userName = 'salama.mohamed';

function getList() {
  getTravelList(apiURL + '/list')
      .then((allData) => {
          generateContent(allData);
      });
}

function formHandler(event) {
    event.preventDefault()
    let city = document.getElementById('name').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    if (city == '' || startDate == '' || endDate == '') {
      alert("You Should Enter All Inputs");
      return;
    }
    const tripStart = new Date(startDate);
    const tripEnd = new Date(endDate);
    const diffDays = Math.ceil(Math.abs(tripEnd - tripStart) / (1000 * 60 * 60 * 24));
    console.log("::: Form Submitted :::")
    getGeonamesData(`${geonamesBaseURL}${city}&username=${userName}`)
    .then((data) => {
      //save data to server
      postData(apiURL +'/add', {//apiURL + 
          location: data.geonames[0].name,
          latitude: data.geonames[0].lat,
          longitude: data.geonames[0].lng,
          countryName: data.geonames[0].countryName,
          population:data.geonames[0].population,
          goDate: startDate,
          duration: diffDays
      }).then(() => {
          getTravelList(apiURL +'/list')// 
              .then((allData) => {
                  generateContent(allData);
                  localStorage.setItem('apiRequest', JSON.stringify(allData));
              });
      });
  })

    .catch(function(erorr) {
      alert('You entered City is not found')
    })
}

export { formHandler , getList}

//for generate html content
function generateContent(allData) { 
  const resultContainer = document.getElementById('result-container');//
  resultContainer.innerHTML = '';
  let resultTemplate = '';
  for (let i = 0; i < allData.length; i++) {
      let template = `
      <div class="destination" style="font-size:20px;line-height:1.5;" >
  <div class="left-side">
      <img class="city-image"
          src=${allData[i].imageUrl == '' ? Client.previewImage : allData[i].imageUrl}>
  </div>
  <div class="right-side">
      <h3>My Trip To:
          <span style="color:red;">${allData[i].location},${allData[i].countryName}</span>
      </h3>
      <h3>Latitude: 
          <span style="color:red;">${allData[i].latitude}</span>
      </h3>
      <h3>Longitude: 
          <span style="color:red;">${allData[i].longitude}</span>
      </h3>
      <h3>Population: 
          <span style="color:red;">${allData[i].population}</span>
      </h3>
      <h3>
          Departing:<span style="color:red;">${allData[i].goDate}</span>
      </h3>
      <h3>Duration: <span style="color:red;">${allData[i].duration}<span> days away.</h3>
      <div class="weather-panel">
          <h4>Typical weather for then is:</h4>
          <h3>Pres: <span style="color:red;">${allData[i].pres}</span><h3>
          <h3>Sunset: <span style="color:red;">${allData[i].sunset}</span></h3>
          <h3>Sunrise: <span style="color:red;">${allData[i].sunrise}<span></h3>
          <h3>Temp: <span style="color:red;">${allData[i].temp}<span></h3>
          <h3>Description: <span style="color:red;">${allData[i].description}<span></h3>
      </div>
      <h3>information for ${allData[i].countryName}:
          <h3>Region:<span style="color:red;">${allData[i].region}</span></h3>
          <h3>Subregion:<span style="color:red;">${allData[i].subregion}</span></h3>
          <h3>Currencies Name:<span style="color:red;">${allData[i].currenciesName}</span></h3>
          <h3>Language:<span style="color:red;">${allData[i].language}</span></h3>
          <h3>Capital:<span style="color:red;">${allData[i].capital}</span></h3>
      </h3>
  </div>
</div>
      `;

      resultTemplate += template;
  }
  resultContainer.innerHTML = resultTemplate;
}

//for get data from the server
const getTravelList = async (requestUrl) => {
  const response = await fetch(requestUrl);
  try {
      const result = await response.json();
      console.log(result);
      return result;

  } catch (error) {
      console.log('error', error);
  }
}

  //get Geonames Data from api geonames
  const getGeonamesData = async (url)=>{

    const res = await fetch(url)

    try {
      const data = await res.json();
      console.log(data)
      return data;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  }
  /* Function to POST data */
// for take data that we want from apis
const postData = async ( url = '', data = {})=>{
  console.log(data)
    const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  });
    try {
       const newData = await response.json();
       console.log(newData);
       return newData
    }catch(error) {
       // appropriately handle the error
       console.log("error", error);
    }
}