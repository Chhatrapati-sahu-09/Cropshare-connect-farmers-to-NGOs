import { useEffect, useState } from "react";
import "./WeatherCard.css";
import { useAuth } from "../hooks/useAuth.js";
import { WiDaySunny } from 'react-icons/wi';
import { FiAlertTriangle } from 'react-icons/fi';

const WeatherCard = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Weather code to readable condition mapping
  const weatherMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Rainy",
    63: "Rain",
    65: "Heavy rain",
    71: "Snowy",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy showers",
    85: "Snow showers",
    86: "Snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with hail",
  };

  // removed emoji mapping — using icons instead

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        let latitude, longitude;

        // If user has location, convert it to coordinates
        if (user?.location) {
          try {
            // Get coordinates from location name
            const geoResponse = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                user.location
              )}&count=1&language=en&format=json`
            );
            const geoData = await geoResponse.json();

            if (geoData.results && geoData.results.length > 0) {
              latitude = geoData.results[0].latitude;
              longitude = geoData.results[0].longitude;
            } else {
              throw new Error("Location not found");
            }
          } catch (err) {
            // Fallback to default location (Raipur, Chhattisgarh)
            latitude = 21.25;
            longitude = 81.63;
          }
        } else {
          // Default location: Raipur, Chhattisgarh
          latitude = 21.25;
          longitude = 81.63;
        }

        // Fetch weather data
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.current_weather) {
          setWeather(weatherData.current_weather);
        } else {
          throw new Error("Failed to fetch weather data");
        }
      } catch (err) {
        setError(err.message || "Unable to load weather");
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.location]);

  if (loading) {
    return (
      <div className="weather-card">
        <div className="weather-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card weather-error">
        <p className="error-text"><FiAlertTriangle className="error-icon" /> {error}</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const condition = weatherMap[weather.weathercode] || "Unknown";
  const temperature = Math.round(weather.temperature);

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h3 className="weather-title"><WiDaySunny className="weather-icon" /> Weather Forecast</h3>
      </div>

      <div className="weather-content">
        <div className="weather-temp">
          <span className="temp-value">{temperature}°C</span>
          <span className="temp-unit"></span>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Condition</span>
            <span className="detail-value">{condition}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">
              {Math.round(weather.windspeed)} km/h
            </span>
          </div>
        </div>
      </div>

      <div className="weather-footer">
        <p className="weather-location">
          {user?.location || "Raipur, Chhattisgarh"}
        </p>
        <p className="weather-time">Updated just now</p>
      </div>
    </div>
  );
};

export default WeatherCard;
