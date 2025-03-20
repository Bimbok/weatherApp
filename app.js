require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const axios = require('axios');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'weather-app-secret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        weather: null, 
        error: null,
        message: req.flash('message')
    });
});

app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            axios.get(weatherUrl),
            axios.get(forecastUrl)
        ]);
        
        const weather = weatherResponse.data;
        const forecast = forecastResponse.data;
        
        res.render('index', { 
            weather: weather, 
            forecast: forecast,
            error: null,
            message: req.flash('message')
        });
    } catch (error) {
        res.render('index', { 
            weather: null, 
            forecast: null,
            error: 'City not found. Please try again.',
            message: req.flash('message')
        });
    }
});

// Get weather by coordinates (geolocation)
app.get('/weather-location', async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            axios.get(weatherUrl),
            axios.get(forecastUrl)
        ]);
        
        const weather = weatherResponse.data;
        const forecast = forecastResponse.data;
        
        // Check if it's an AJAX request
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            // Return only the weather info section
            res.render('partials/weather-info', { 
                weather: weather,
                forecast: forecast,
                error: null,
                message: 'Weather data for your current location'
            });
        } else {
            // Regular request - return full page
            res.render('index', { 
                weather: weather, 
                forecast: forecast,
                error: null,
                message: 'Weather data for your current location'
            });
        }
    } catch (error) {
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.status(500).json({ error: 'Error fetching weather data. Please try again.' });
        } else {
            req.flash('message', 'Error fetching weather for your location. Please try again or search by city.');
            res.redirect('/');
        }
    }
});

// Forecast page route
app.get('/forecast/:city/:country', async (req, res) => {
    const { city, country } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(forecastUrl);
        const forecast = response.data;
        
        res.render('forecast', { 
            city: city,
            country: country,
            forecast: forecast,
            error: null
        });
    } catch (error) {
        res.render('forecast', { 
            city: city,
            country: country,
            forecast: null,
            error: 'Error fetching forecast data. Please try again.'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 