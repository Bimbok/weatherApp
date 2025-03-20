# Modern Weather App

A beautiful and feature-rich weather application built with Node.js, Express, and EJS.

## Features

- Real-time weather information
- Modern and responsive design
- Smooth animations
- Detailed weather statistics
- Automatic geolocation detection
- Manual city search functionality
- Persistent location settings
- Error handling
- Mobile-friendly interface

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- OpenWeather API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenWeather API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Get an API key from [OpenWeather](https://openweathermap.org/api)

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Using Geolocation

The app provides two ways to use your location:

1. **Manual location detection**: Click the "Use My Location" button to fetch weather data for your current location.
2. **Automatic location detection**: Toggle the "Automatically detect my location" switch to have the app automatically fetch your location each time you open it.

Note: You'll need to allow location access in your browser for this feature to work.

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript)
- HTML5 Geolocation API
- Bootstrap 5
- Animate.css
- Font Awesome
- OpenWeather API
- Axios 