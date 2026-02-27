// ===============================
// API Configuration
// ===============================
const API_KEY = "91d2b7fb7555fd7b6c21987e6a1e7ea9";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// ===============================
// DOM Elements
// ===============================
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

// ===============================
// Show Welcome Message
// ===============================
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <h2>🌤️ Welcome to the Weather App</h2>
        <p>Enter a city name to get started!</p>
    </div>
`;

// ===============================
// Show Loading
// ===============================
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;
}

// ===============================
// Show Error
// ===============================
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <span class="error-icon">❌</span>
            <span>${message}</span>
        </div>
    `;
}

// ===============================
// Fetch Weather (Async/Await)
// ===============================
async function getWeather(city) {
    showLoading();

    // ✅ FIXED (added backticks)
    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
        const response = await axios.get(url);
        displayWeather(response.data);

    } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check the spelling.");
        } else {
            showError("Unable to fetch weather data. Please try again.");
        }

    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

// ===============================
// Display Weather
// ===============================
function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    // ✅ FIXED (added backticks)
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherDisplay.innerHTML = `
        <div class="weather-card">
            <h2>${cityName}</h2>
            <img src="${iconUrl}" alt="${description}">
            <div class="temperature">${temperature}°C</div>
            <p>${description}</p>
        </div>
    `;

    cityInput.focus();
}

// ===============================
// Search Handler
// ===============================
function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name must be at least 2 characters long.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
}

// ===============================
// Event Listeners
// ===============================
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

