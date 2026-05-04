// OpenWeatherMap API configuration
const API_KEY = '4a69cc088dcd8bf1ffe068706f059781';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWeather(city) {
    if (!city) return;
    
    const weatherResult = document.getElementById('weatherResult');
    if (!weatherResult) return;
    
    weatherResult.innerHTML = '⏳ Загрузка данных с OpenWeatherMap...';
    
    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&lang=ru&appid=${API_KEY}`;
        console.log('Запрос к API:', url.replace(API_KEY, 'HIDDEN'));
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Неверный API ключ');
            } else if (response.status === 404) {
                throw new Error(`Город "${city}" не найден`);
            } else {
                throw new Error(`Ошибка API: ${response.status}`);
            }
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Ошибка при запросе погоды:', error);
        weatherResult.innerHTML = `
            <div class="weather-card" style="background: #ef4444;">
                <h3>❌ Ошибка</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = Math.round(data.wind.speed * 3.6);
    const windDeg = data.wind.deg;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const cityName = data.name;
    const country = data.sys.country;
    
    const windDirections = ['северный', 'северо-восточный', 'восточный', 'юго-восточный', 'южный', 'юго-западный', 'западный', 'северо-западный'];
    const windDirection = windDirections[Math.round(windDeg / 45) % 8];
    const iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
    
    weatherResult.innerHTML = `
        <div class="weather-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>📍 ${cityName}, ${country}</h3>
                <img src="${iconUrl}" alt="${description}" style="width: 50px; height: 50px;">
            </div>
            <div class="weather-temp">${temp}°C</div>
            <div>🌡 Ощущается как: ${feelsLike}°C</div>
            <div>☁️ ${description.charAt(0).toUpperCase() + description.slice(1)}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px;">
                <div>💧 Влажность: ${humidity}%</div>
                <div>📊 Давление: ${pressure} hPa</div>
                <div>💨 Ветер: ${windSpeed} км/ч</div>
                <div>🧭 Направление: ${windDirection}</div>
            </div>
            <small style="display: block; margin-top: 12px; color: rgba(255,255,255,0.7);">
                Данные: OpenWeatherMap
            </small>
        </div>
    `;
}

function renderWeather() {
    const container = document.getElementById('weather');
    if (!container) return;
    
    container.innerHTML = `
        <div class="weather-container">
            <div class="weather-search">
                <input type="text" class="weather-input" id="cityInput" placeholder="Введите город" value="Moscow">
                <button class="weather-btn" id="getWeatherBtn">🔍 Узнать погоду</button>
            </div>
            <div id="weatherResult"></div>
        </div>
    `;
    
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    if (getWeatherBtn) {
        getWeatherBtn.addEventListener('click', () => {
            const cityInput = document.getElementById('cityInput');
            const city = cityInput ? cityInput.value.trim() : 'Moscow';
            if (city) {
                fetchWeather(city);
            }
        });
    }
    
    fetchWeather('Moscow');
}

function initWeather() {
    renderWeather();
}

window.initWeather = initWeather;
