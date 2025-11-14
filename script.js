// Set the base configuration and API details
const API_KEY = '23251043e343ab8ba13f8bfc662d40bd'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const DEFAULT_CITY = 'New Delhi';
const UNITS = 'metric'; // Celsius

// DOM Element Cache
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const statusMessage = document.getElementById('statusMessage');
const currentWeatherSection = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const forecastContainer = document.getElementById('forecastContainer');
const backgroundContainer = document.getElementById('background-container');
const body = document.body;

// Data display elements map
const D = {
    location: document.getElementById('locationDisplay'),
    description: document.getElementById('descriptionDisplay'),
    date: document.getElementById('dateDisplay'),
    icon: document.getElementById('iconDisplay'),
    temp: document.getElementById('tempDisplay'),
    feelsLike: document.getElementById('feelsLikeDisplay'),
    humidity: document.getElementById('humidityDisplay'),
    wind: document.getElementById('windDisplay'),
    pressure: document.getElementById('pressureDisplay'),
};

// --- Utility Functions ---

/**
 * Maps OpenWeatherMap icon code to a relevant Unicode emoji.
 * @param {string} iconCode - The icon code from the API response.
 * @returns {string} Emoji symbol.
 */
function getIconEmoji(iconCode) {
    switch (iconCode.slice(0, 2)) {
        case '01': return iconCode.endsWith('n') ? '🌙' : '☀️'; // Clear sky (Night vs Day)
        case '02': return iconCode.endsWith('n') ? '☁️' : '🌤️'; // Few clouds (Using moon/star emoji is too complex without proper assets, defaulting to simple cloud)
        case '03': return '☁️'; // Scattered clouds
        case '04': return '🌥️'; // Broken clouds/Overcast 
        case '09': return '🌧️'; // Shower rain
        case '10': return '🌦️'; // Rain
        case '11': return '⛈️'; // Thunderstorm
        case '13': return '🌨️'; // Snow
        case '50': return '🌫️'; // Mist/Fog
        default: return '🌡️'; // Default
    }
}

/**
 * Custom messaging/error display (replaces alert()).
 * @param {string} message - The message to display.
 * @param {string} type - 'error' or 'info'.
 */
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-blue-100', 'text-blue-700');
    if (type === 'error') {
        statusMessage.classList.add('bg-red-100', 'text-red-700');
    } else {
        statusMessage.classList.add('bg-blue-100', 'text-blue-700');
    }
    statusMessage.classList.remove('hidden');
}

/**
 * Formats a Unix timestamp into a readable date string, considering the city's timezone.
 * @param {number} timestamp - Unix timestamp.
 * @param {number} timezoneOffsetSeconds - Offset in seconds from UTC.
 * @returns {string} Formatted date string.
 */
function formatUnixTime(timestamp, timezoneOffsetSeconds) {
    const date = new Date((timestamp + timezoneOffsetSeconds) * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    // To ensure correct day name relative to the city's timezone
    const offsetMinutes = timezoneOffsetSeconds / 60;
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    const cityLocalTime = utcTime + (offsetMinutes * 60000);
    
    return new Date(cityLocalTime).toLocaleDateString('en-US', options);
}


/**
 * Applies CSS classes and injects HTML for background animations based on weather condition and time of day.
 * @param {string} mainWeather - The main weather group (e.g., 'Clear', 'Clouds', 'Rain').
 * @param {string} iconCode - The icon code from the API response (used to check for 'n' for night).
 */
function applyWeatherAnimation(mainWeather, iconCode) {
    // Clear previous classes and content
    body.classList.remove('clear-bg', 'cloudy-bg', 'rain-bg', 'storm-bg', 'night-bg');
    backgroundContainer.innerHTML = '';
    
    let htmlContent = '';
    const isNight = iconCode.endsWith('n');

    switch (mainWeather) {
        case 'Clear':
            if (isNight) {
                body.classList.add('clear-bg', 'night-bg');
                // Inject stars/moon for night background
                for (let i = 0; i < 50; i++) {
                    const style = `top: ${Math.random() * 95}%; left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 5}s;`;
                    htmlContent += `<div class="star-element" style="${style}"></div>`;
                }
            } else {
                body.classList.add('clear-bg');
                // Inject a simple sun element for animation
                htmlContent = '<div class="sun-element"></div>';
            }
            break;

        case 'Clouds':
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
        case 'Sand':
        case 'Ash':
        case 'Squall':
        case 'Tornado':
            body.classList.add('cloudy-bg');
            if (isNight) body.classList.add('night-bg');

            // Inject multiple moving clouds at random positions
            for (let i = 0; i < 5; i++) {
                const style = `top: ${Math.random() * 80 + 10}%; left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 10}s; animation-duration: ${Math.random() * 30 + 30}s;`;
                htmlContent += `<div class="cloud-element" style="${style}"></div>`;
            }
            break;

        case 'Rain':
        case 'Drizzle':
        case 'Shower':
            body.classList.add('rain-bg');
            if (isNight) body.classList.add('night-bg');
            // Inject rain drops (using a high number of drops)
            for (let i = 0; i < 150; i++) {
                const style = `left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; opacity: ${Math.random() * 0.5 + 0.3}; animation-delay: ${Math.random() * 2}s;`;
                htmlContent += `<div class="rain-drop" style="${style}"></div>`;
            }
            break;

        case 'Thunderstorm':
        case 'Extreme':
            body.classList.add('storm-bg');
            if (isNight) body.classList.add('night-bg');
            break;

        case 'Snow':
            body.classList.add('cloudy-bg'); 
            if (isNight) body.classList.add('night-bg');
            // If you want snowflake animation, add similar logic to rain drops here.
            break;

        default:
            body.classList.add('clear-bg'); 
            if (isNight) body.classList.add('night-bg');
            break;
    }

    backgroundContainer.innerHTML = htmlContent;
}


// --- API Fetching Logic ---

async function getCityCoordinates(city) {
    const geoUrl = `${GEO_URL}?q=${city}&limit=1&appid=${API_KEY}`;
    
    try {
        const response = await fetch(geoUrl);
        if (response.status === 401) {
             showStatus('FATAL ERROR: The API Key is unauthorized (Code 401). Please check the key in script.js.', 'error');
             return null;
        }
        const data = await response.json();
        
        if (response.ok && data.length > 0) {
            return { 
                lat: data[0].lat, 
                lon: data[0].lon, 
                name: data[0].name, 
                country: data[0].country 
            };
        } else {
            return null;
        }

    } catch (error) {
        console.error('Geocoding failed:', error);
        return null;
    }
}


async function fetchWeather(locationData) {
    const { lat, lon, name, country } = locationData;
    
    const currentWeatherUrl = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}`;

    try {
        const response = await fetch(currentWeatherUrl);
        const currentData = await response.json();

        if (response.ok && currentData.cod === 200) {
            
            displayCurrentWeather(currentData, name, country);
            
            // NEW: Pass the icon code to determine day/night animation
            const iconCode = currentData.weather[0].icon;
            applyWeatherAnimation(currentData.weather[0].main, iconCode);

            await fetchForecast(lat, lon);
            
            statusMessage.classList.add('hidden');
            currentWeatherSection.classList.remove('hidden');
            setTimeout(() => currentWeatherSection.classList.remove('opacity-0'), 10); 

        } else if (currentData.cod === 401) {
            showStatus('ERROR: API Key is invalid or inactive (Code 401). Please check your key status.', 'error');
        } else {
            throw new Error(currentData.message || 'Unknown API error.');
        }

    } catch (error) {
        console.error('Weather fetching failed:', error);
        showStatus(`Failed to fetch weather data. Please try again or check your network connection. Details: ${error.message}`, 'error');
    }
}


async function fetchForecast(lat, lon) {
    const forecastUrl = `${BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}`;
    
    try {
        const response = await fetch(forecastUrl);
        const forecastData = await response.json();
        
        if (response.ok && forecastData.cod === '200') {
            displayForecast(forecastData);
            forecastSection.classList.remove('hidden');
        } else {
            console.error('Forecast fetching failed:', forecastData.message);
        }
    } catch (error) {
        console.error('Forecast fetching failed:', error);
    }
}


// --- Rendering Functions ---

function displayCurrentWeather(data, cityName, countryCode) {
    const tempC = Math.round(data.main.temp);
    const feelsLikeC = Math.round(data.main.feels_like);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    D.location.textContent = `${cityName}, ${countryCode}`;
    D.description.textContent = description;
    D.date.textContent = formatUnixTime(data.dt, data.timezone);
    D.icon.textContent = getIconEmoji(iconCode);
    D.temp.textContent = tempC;
    D.feelsLike.textContent = `${feelsLikeC}°C`;
    D.humidity.textContent = `${data.main.humidity}%`;
    D.wind.textContent = `${data.wind.speed.toFixed(1)} m/s`;
    D.pressure.textContent = `${data.main.pressure} hPa`;
}

function displayForecast(data) {
    forecastContainer.innerHTML = '';
    const forecastItems = {};

    data.list.forEach(item => {
        const localTimestamp = item.dt + data.city.timezone;
        const localDate = new Date(localTimestamp * 1000);
        
        const dateStr = localDate.toISOString().split('T')[0];

        if (!forecastItems[dateStr]) {
            forecastItems[dateStr] = {
                temps: [],
                icon: item.weather[0].icon,
                description: item.weather[0].description
            };
        }
        forecastItems[dateStr].temps.push(item.main.temp_max, item.main.temp_min);
        forecastItems[dateStr].icon = item.weather[0].icon;
        forecastItems[dateStr].description = item.weather[0].description;
    });

    const uniqueDates = Object.keys(forecastItems).sort();
    const forecastDays = uniqueDates.slice(1, 4); 

    forecastDays.forEach(dateStr => {
        const dayData = forecastItems[dateStr];
        const maxTemp = Math.max(...dayData.temps);
        const minTemp = Math.min(...dayData.temps);
        
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const card = `
            <div class="forecast-item bg-white p-5 rounded-xl shadow-md border-t-4 border-blue-400 text-center">
                <p class="text-lg font-semibold text-gray-800">${dayName} <span class="text-sm font-normal text-gray-500">(${monthDay})</span></p>
                <div class="weather-icon text-4xl mt-2">${getIconEmoji(dayData.icon)}</div>
                <p class="text-md text-gray-600 capitalize mt-2">${dayData.description}</p>
                <p class="text-2xl font-bold mt-3 text-gray-900">${Math.round(maxTemp)}&deg;C</p>
                <p class="text-sm text-gray-500">Min: ${Math.round(minTemp)}&deg;C</p>
            </div>
        `;
        forecastContainer.insertAdjacentHTML('beforeend', card);
    });
}

// --- Main Handler ---

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showStatus('Please enter a city name to search.', 'info');
        return;
    }

    currentWeatherSection.classList.add('opacity-0');
    currentWeatherSection.classList.add('hidden');
    forecastSection.classList.add('hidden');
    showStatus('Finding location and fetching weather data for ' + city + '...', 'info');
    searchButton.disabled = true;

    try {
        const locationData = await getCityCoordinates(city);

        if (locationData) {
            await fetchWeather(locationData);
        } else {
            if (!statusMessage.classList.contains('bg-red-100')) {
                showStatus(`Error: City "${city}" not found. Please check the spelling or provide more detail.`, 'error');
            }
        }

    } catch (error) {
        console.error('An unexpected error occurred during the search:', error);
        showStatus('An unexpected error occurred. Check the console for details.', 'error');
    } finally {
        searchButton.disabled = false;
    }
}

// --- Event Listeners and Initialization ---

function initApp() {
    searchButton.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    handleSearch(DEFAULT_CITY); 
}

window.onload = initApp;