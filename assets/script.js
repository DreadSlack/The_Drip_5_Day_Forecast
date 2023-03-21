var locationHistory = [];
var solarApiRootUrl = 'https://api.openweathermap.org';
var solarApiKey = '966d9e3bb7fcf8e9e293954ae2c44796';

//TODO: Grab HTML Elements
var locationForm = document.querySelector('#local-t');
var locationInput = document.querySelector('#local-input');
var currentConatiner = document.querySelector('#today');
var toComeContainer = document.querySelector('#forecast');
var locationHistoryContainer = document.querySelector('#previous');

//TODO: Grab day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

//TODO: Create a Previous Search History Register
//TODO: Use StoredLocation for the Search History
function digestSrc(){
    var storedLocation = localStorage.getItem('search-history');
    if(storedLocation){
        locationHistory = JSON.parse(storedLocation);
    }
    loadPastHis();
}

//TODO: Add New Search to the Search Registry 
function adjustPastHis(search){
    if (locationHistory.indexOf(search) !== -1){
        return;
    }
    locationHistory.push(search);
    localStorage.setItem('search-history', JSON.stringify(locationHistory));
    loadPastHis();
}


//TODO: Create Clickable Buttons to Pull a Previously Searched Town
function loadPastHis(){
    locationHistoryContainer.innerHTML = '';
    for (var i = locationHistory.length -1; i >= 0; i--){
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.classList.add('history-btn', 'btn-history');
        btn.setAttribute('data-location', locationHistory[i]);
        btn.textContent = locationHistory[i];
        locationHistoryContainer.append(btn);
    }
}

//TODO: Create a Function to Collect the Required Data from the Main Search and Run it Through the Function
//CONT:... to Dictate the Time, Date, and to Make the Cards Where the Information of the Search Will Stored/Presented
function activeWeather (city, weather){
    var day = dayjs().format('M/D/YYYY');
    var appleF = weather.main.temp;
    var airSpeed = weather.wind.speed;
    var wetness = weather.main.humidity;
    var pictureUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var pictureDescription = weather.weather[0].description || weather[0].main;
    var post = document.createElement('div');
    var postBody = document.createElement('div');
    var heading = document.createElement('h2');
    var skyIcon = document.createElement('img');
    var appleEl = document.createElement('p');
    var speedEl = document.createElement('p');
    var wetnessEl = document.createElement('p');
    post.setAttribute('class', 'card');
    postBody.setAttribute('class', 'card-body');
    post.append(postBody);
    heading.setAttribute('class', 'h3 card-title');
    appleEl.setAttribute('class', 'card-text');
    speedEl.setAttribute('class', 'card-text');
    wetnessEl.setAttribute('class', 'card-text');
    heading.textContent = `${city} (${day})`;
    skyIcon.setAttribute('src', pictureUrl);
    skyIcon.setAttribute('src', pictureDescription);
    skyIcon.setAttribute('class', 'sky-img');
    heading.append(skyIcon);
    appleEl.textContent = `Temp: ${appleF} °F`;
    speedEl.textContent = `Wind: ${airSpeed} MPH`;
    wetnessEl.textContent = `Humidity: ${wetness} %`;
    postBody.append(heading, appleEl, speedEl, wetnessEl);
    currentConatiner.innerHTML = '';
    currentConatiner.append(post);
}

//TODO: Make a Packed Function to Create all the Forecast cards to Display the Various Diffrent Categories Bassed on the Search Criteria
function drawRainPostSrc(forecast) {
    var pictureUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var pictureDescription = forecast.weather[0].description;
    var appleF = forecast.main.temp;
    var wetness = forecast.main.humidity;
    var airSpeed = forecast.wind.speed;
    var col = document.createElement('div');
    var post = document.createElement('div');
    var postBody = document.createElement('div');
    var postTitle = document.createElement('h5');
    var skyIcon = document.createElement('img');
    var appleEl = document.createElement('p');
    var speedEl = document.createElement('p');
    var wetnessEl = document.createElement('p');
    col.append(post);
    post.append(postBody);
    postBody.append(postTitle, skyIcon, appleEl, speedEl, wetnessEl);
    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-vard');
    post.setAttribute('class', 'card bg1 h-100 text-white');
    postBody.setAttribute('class', 'card-body p');
    postTitle.setAttribute('class', 'card-text');
    appleEl.setAttribute('class', 'card-text');
    speedEl.setAttribute('class', 'card-text');
    wetnessEl.setAttribute('class', 'card-text');
    postTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    skyIcon.setAttribute('src', pictureUrl);
    skyIcon.setAttribute('alt', pictureDescription);
    appleEl.textContent = `Temp: ${appleF} °F`;
    speedEl.textContent = `Wind: ${airSpeed} MPH`;
    wetnessEl.textContent = `Humidity: ${wetness} %`;    
    toComeContainer.append(col);
}

//TODO: Use Day.js to Grab the Current Date Then Use That Date to Find Next the Current Date to Make it Useable in Telling the Forecast
function drawRain(dailyForecast){
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();
    var headingCol = document.createElement('div')
    var heading = document.createElement('h4');
    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:'
    headingCol.append(heading);
    toComeContainer.innerHTML = '';
    toComeContainer.append(headingCol);
    for (var i = 0; i < dailyForecast.length; i++){
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
                drawRainPostSrc(dailyForecast[i]);
            }
        }
    }
}

//TODO: Make a Function to Find the Exact Place Searched for as a variable
function drawItems(city, data){
    activeWeather(city, data.list[0], data.city.timezone);
    drawRain(data.list);
}

//TODO: Make a Function to Find the Exact Place Searched for as a variable cont...
function howHotCold(location){
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var apiUrl = `${solarApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${solarApiKey}`;
    fetch(apiUrl)
    .then(function (res){
        return res.json();
    })
    .then(function (data){
        drawItems(city, data);
    })
    .catch(function (err){
        console.error(err);
    });
}

//TODO: Make a Function to Stop Invalid Searches and Actually Run the Search Function
function findWhereThere(search){
    var apiUrl = `${solarApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${solarApiKey}`;
    fetch(apiUrl)
    .then(function (res){
        return res.json();
    })
    .then(function (data){
        if (!data[0]){
            alert('Location not found');
        } else{
            adjustPastHis(search);
            howHotCold(data[0]);
        }
    })
    .catch(function (err){
        close.error(err);
    })
}

//TODO: Make a Function to Handle the Search Functionallity of the Page by Way of the Enter Button
function handleSearchFormSubmit(e){
    if (!locationInput.value){
        return;
    }
    e.preventDefault();
    var location = locationInput.value.trim();
    findWhereThere(location);
    locationInput.value = '';
}

//TODO: Make a Function to Handle the Search Functionallity of the Page by Way of the Search Button
function handleSeachHistoryClick(e){
    if (!e.target.matches('.btn-history')){
        return;
    }
    var btn = e.target;
    var location = btn.getAttribute('data-location');
    findWhereThere(location);
}

//TODO: Make Evennt Listeners to Hear for the ENTER key or the SEARCH button
digestSrc();
locationForm.addEventListener('submit', handleSearchFormSubmit);
locationHistoryContainer.addEventListener('click', handleSeachHistoryClick);
