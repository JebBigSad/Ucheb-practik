async function fetchWeather(city) {
    if (!city) return;
    
    const weatherResult = document.getElementById('weatherResult');
    if (!weatherResult) return;
    
    weatherResult.innerHTML = '⏳ Загрузка данных о погоде...';
    
    try {
        const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=ru`)}`;
        console.log('Запрос к API через прокси:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        
        const data = await response.json();
        displayWeather(data, city);
    } catch (error) {
        console.error('Ошибка при запросе погоды:', error);
        showDemoWeather(city);
    }
}

function displayWeather(data, cityName) {
    const weatherResult = document.getElementById('weatherResult');
    
    try {
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const feelsLike = current.FeelsLikeC;
        const humidity = current.humidity;
        const pressure = current.pressure;
        const windSpeed = current.windspeedKmph;
        const desc = current.weatherDesc[0].value;
        
        let weatherIcon = '';
        if (desc.includes('солнечно') || desc.includes('ясно')) weatherIcon = '☀️';
        else if (desc.includes('облачно')) weatherIcon = '☁️';
        else if (desc.includes('дождь')) weatherIcon = '🌧️';
        else if (desc.includes('снег')) weatherIcon = '❄️';
        else weatherIcon = '🌡️';
        
        weatherResult.innerHTML = `
            <div class="weather-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>📍 ${cityName.charAt(0).toUpperCase() + cityName.slice(1)}</h3>
                    <div style="font-size: 3rem;">${weatherIcon}</div>
                </div>
                <div class="weather-temp">${temp}°C</div>
                <div>🌡 Ощущается как: ${feelsLike}°C</div>
                <div>☁️ ${desc}</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px;">
                    <div>💧 Влажность: ${humidity}%</div>
                    <div>📊 Давление: ${pressure} hPa</div>
                    <div>💨 Ветер: ${windSpeed} км/ч</div>
                </div>
                <small style="display: block; margin-top: 12px; color: rgba(255,255,255,0.7);">
                    Данные: wttr.in
                </small>
            </div>
        `;
        
        // 💾 Сохраняем в БД, если API доступен
        if (window.API && temp) {
            window.API.saveWeatherQuery(cityName, temp, humidity, desc);
        }
    } catch (error) {
        console.error('Ошибка отображения погоды:', error);
        showDemoWeather(cityName);
    }
}

function showDemoWeather(city) {
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `
        <div class="weather-card" style="background: #3b82f6;">
            <h3>📍 ${city}</h3>
            <div class="weather-temp">+18°C</div>
            <div>☁️ Облачно, без осадков</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px;">
                <div>💧 Влажность: 65%</div>
                <div>📊 Давление: 1013 hPa</div>
                <div>💨 Ветер: 5 км/ч</div>
            </div>
            <small style="display: block; margin-top: 12px; color: rgba(255,255,255,0.7);">
                🔧 Демо-режим (API временно недоступен)
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
