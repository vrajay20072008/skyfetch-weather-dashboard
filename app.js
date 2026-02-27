// Your OpenWeatherMap API Key
const API_KEY = '80af9604612ffdc53c830615a50bcfd0';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get references to HTML elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

// 🔥 Async Weather Function
async function getWeather(city) {

    showLoading();

    // 🔒 Disable button
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    try {

        const response = await axios.get(url);

        displayWeather(response.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check spelling.");
        } else {
            showError("Something went wrong. Please try again.");
        }

    } finally {

        // 🔓 Re-enable button
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

// Display Weather
function displayWeather(data) {

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;

// 🎯 Focus back to input
    cityInput.focus();
}

// Show Error Message
function showError(message) {

    const errorHTML = `
        <div class="error-message">
            <h3>⚠️ Oops!</h3>
            <p>${message}</p>
        </div>
    `;

    weatherDisplay.innerHTML = errorHTML;
}

//
// 🔎 SEARCH BUTTON EVENT
//
searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    // ❌ Empty or only spaces
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    // ❌ Too short
    if (city.length < 2) {
        showError("City name must be at least 2 characters.");
        return;
    }

    // ✅ Valid → fetch weather
    getWeather(city);

    cityInput.value = "";
});

//
// ⌨️ ENTER KEY SUPPORT
//
cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        searchBtn.click();   // triggers same logic
    }
});

//
// 🌤️ Welcome Message on Page Load
//
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <h2>🌤️ Welcome to SkyFetch</h2>
        <p>Enter a city name above to get the latest weather updates!</p>
    </div>
`;
function showLoading() {

    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;

    weatherDisplay.innerHTML = loadingHTML;
}