const API_KEY = 'ed201468aee33e8ee660c10255cdffb5';

function checkCurrentWeather() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchCurrentWeather(city);
    } else {
        alert('Por favor ingresa el nombre de la ciudad');
    }
}

function checkFiveDayWeather() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchFiveDayWeather(city);
    } else {
        alert('Por favor ingresa el nombre de la ciudad');
    }
}

function fetchCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=es&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el clima actual');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
        });
}

function fetchFiveDayWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&lang=es&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el pronóstico de 5 días');
            }
            return response.json();
        })
        .then(data => {
            displayFiveDayWeather(data);
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
        });
}

function displayCurrentWeather(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    const weatherIcon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

    resultsDiv.innerHTML = `
        <div class="weather-card">
            <h3>Clima en ${data.name}</h3>
            <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
            <p>${data.weather[0].description}</p>
            <p>Temperatura: ${data.main.temp}°C</p>
            <p>Sensación térmica: ${data.main.feels_like}°C</p>
            <p>Humedad: ${data.main.humidity}%</p>
        </div>
    `;
}

function displayFiveDayWeather(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const groupedData = groupByDay(data.list);

    for (const [day, forecasts] of Object.entries(groupedData)) {
        const dayWeather = forecasts[0];
        const weatherIcon = dayWeather.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

        resultsDiv.innerHTML += `
            <div class="weather-card">
                <h3>${day}</h3>
                <img src="${iconUrl}" alt="${dayWeather.weather[0].description}" class="weather-icon">
                <p>${dayWeather.weather[0].description}</p>
                <p>Temperatura máxima: ${dayWeather.main.temp_max}°C</p>
                <p>Temperatura mínima: ${dayWeather.main.temp_min}°C</p>
                <p>Humedad: ${dayWeather.main.humidity}%</p>
            </div>
        `;
    }
}


function groupByDay(list) {
    const days = {};
    list.forEach(item => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        if (!days[day]) {
            days[day] = [];
        }
        days[day].push(item);
    });

    const newDays = Object.keys(days).slice(0, 5).reduce((result, key) => {
        result[key] = days[key];
        return result;
    }, {});

    return newDays;
}