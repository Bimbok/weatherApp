// Get user's current location
document.addEventListener('DOMContentLoaded', function() {
    // Theme handling
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        updateThemeIcon(systemTheme);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', systemTheme);
            updateThemeIcon(systemTheme);
        }
    });

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Greeting and Time handling
    function updateGreetingAndTime() {
        const greetingText = document.getElementById('greeting-text');
        const currentTime = document.getElementById('current-time');
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Set greeting based on time of day
        let greeting;
        if (hour < 12) {
            greeting = 'Good Morning';
        } else if (hour < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        greetingText.textContent = greeting;

        // Format time with leading zeros
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        currentTime.textContent = formattedTime;
    }

    // Update greeting and time immediately and then every second
    updateGreetingAndTime();
    setInterval(updateGreetingAndTime, 1000);

    // Location handling
    const getLocationBtn = document.getElementById('get-location');
    const locationStatus = document.getElementById('location-status');
    let isLocationRequestInProgress = false;

    function getLocation() {
        if (isLocationRequestInProgress) return;
        isLocationRequestInProgress = true;

        if (navigator.geolocation) {
            // Show loading status
            locationStatus.textContent = 'Fetching your location...';
            locationStatus.style.display = 'block';
            locationStatus.className = 'mt-2 text-info';

            // Get current position
            navigator.geolocation.getCurrentPosition(
                // Success callback
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    locationStatus.textContent = 'Location found! Fetching weather...';
                    
                    // Send coordinates to the server
                    window.location.href = `/weather-location?lat=${latitude}&lon=${longitude}`;
                },
                // Error callback
                function(error) {
                    isLocationRequestInProgress = false;
                    locationStatus.className = 'mt-2 text-danger';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            locationStatus.textContent = 'Location access was denied. Please allow location access or enter a city manually.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            locationStatus.textContent = 'Location information is unavailable. Please try again later or enter a city manually.';
                            break;
                        case error.TIMEOUT:
                            locationStatus.textContent = 'Location request timed out. Please try again or enter a city manually.';
                            break;
                        default:
                            locationStatus.textContent = 'An unknown error occurred. Please try again or enter a city manually.';
                            break;
                    }
                },
                // Options
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            isLocationRequestInProgress = false;
            locationStatus.textContent = 'Geolocation is not supported by this browser. Please enter a city manually.';
            locationStatus.style.display = 'block';
            locationStatus.className = 'mt-2 text-danger';
        }
    }

    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getLocation);
    }

    // Auto-detect location on page load (if user wants)
    function autoDetectLocation() {
        if (localStorage.getItem('autoDetectLocation') === 'true' && navigator.geolocation) {
            getLocationBtn.click();
        }
    }

    // Add toggle for auto-detection
    const autoDetectToggle = document.getElementById('auto-detect-toggle');
    if (autoDetectToggle) {
        // Initialize toggle state from localStorage
        autoDetectToggle.checked = localStorage.getItem('autoDetectLocation') === 'true';
        
        autoDetectToggle.addEventListener('change', function() {
            if (this.checked) {
                // Show confirmation dialog
                if (confirm('Would you like to enable automatic location detection? This will fetch your location each time you open the app.')) {
                    localStorage.setItem('autoDetectLocation', 'true');
                    // Only get location if we're not already showing weather data
                    if (!document.querySelector('.weather-info')) {
                        getLocation();
                    }
                } else {
                    this.checked = false;
                }
            } else {
                localStorage.setItem('autoDetectLocation', 'false');
                locationStatus.style.display = 'none';
            }
        });
    }

    // Run auto-detection on page load only if we're not already showing weather data
    if (localStorage.getItem('autoDetectLocation') === 'true' && !document.querySelector('.weather-info')) {
        getLocation();
    }
}); 