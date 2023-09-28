const apiKey = '9bf49f219118a16334968f47ce05b019'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const unitCelsius = document.getElementById('unitCelsius');
const unitFahrenheit = document.getElementById('unitFahrenheit');
const geolocationButton = document.getElementById('geolocationButton');

searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    const unit = getSelectedUnit();

    if (location === '') {
        showError('Please enter a location.');
        return;
    }

    fetchWeatherData(location, unit);
});

geolocationButton.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const unit = getSelectedUnit();
            fetchWeatherDataByCoordinates(latitude, longitude, unit);
        }, () => {
            showError('Geolocation is disabled or not available.');
        });
    } else {
        showError('Geolocation is not supported by your browser.');
    }
});

function getSelectedUnit() {
    return unitCelsius.checked ? 'metric' : 'imperial';
}

function fetchWeatherData(location, unit) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            showError('Could not fetch weather data. Please try again later.');
            console.error(error);
        });
}

function fetchWeatherDataByCoordinates(latitude, longitude, unit) {
    const url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            showError('Could not fetch weather data. Please try again later.');
            console.error(error);
        });
}

function displayWeatherData(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;

    const weatherHTML = `
        <h2>Weather in ${cityName}</h2>
        <p>Temperature: ${temperature}°</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Conditions: ${description}</p>
    `;

    weatherInfo.innerHTML = weatherHTML;
    weatherInfo.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
}
