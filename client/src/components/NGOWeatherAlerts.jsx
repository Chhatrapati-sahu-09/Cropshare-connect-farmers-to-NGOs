import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import "./NGOWeatherAlerts.css";
import { FiAlertTriangle, FiCloud, FiWind, FiDroplet } from "react-icons/fi";

const NGOWeatherAlerts = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);

  // Weather severity levels
  const getSeverity = (weatherCode) => {
    if ([95, 96, 99].includes(weatherCode)) return "severe"; // Thunderstorms
    if ([65, 75, 82, 86].includes(weatherCode)) return "warning"; // Heavy rain/snow
    if ([45, 48].includes(weatherCode)) return "caution"; // Fog
    return "safe";
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "severe":
        return "⛈️";
      case "warning":
        return "⚠️";
      case "caution":
        return "🌫️";
      default:
        return "✅";
    }
  };

  const getPickupSuggestion = (weatherCode, windspeed) => {
    if ([95, 96, 99].includes(weatherCode)) {
      return "Postpone pickups - Severe thunderstorm warning";
    }
    if ([65, 75, 82, 86].includes(weatherCode)) {
      return "Schedule for afternoon - Heavy rain/snow expected morning";
    }
    if ([45, 48].includes(weatherCode)) {
      return "Use extra caution - Low visibility conditions";
    }
    if (windspeed > 40) {
      return "Schedule for early morning - High winds expected";
    }
    if ([0, 1].includes(weatherCode)) {
      return "Ideal conditions for pickup operations";
    }
    return "Good conditions for pickup";
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        let latitude, longitude;

        // Get location from user profile
        if (user?.location) {
          try {
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
            // Fallback to default location
            latitude = 21.25;
            longitude = 81.63;
          }
        } else {
          // Default location: Raipur
          latitude = 21.25;
          longitude = 81.63;
        }

        // Fetch current weather + forecast
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.current_weather) {
          setWeather(weatherData.current_weather);

          // Extract next 3 days forecast
          if (weatherData.daily) {
            const daily = weatherData.daily;
            const forecastDays = [];
            for (let i = 1; i <= 3 && i < daily.weather_code.length; i++) {
              forecastDays.push({
                day: i,
                code: daily.weather_code[i],
                tempMax: daily.temperature_2m_max[i],
                tempMin: daily.temperature_2m_min[i],
                windMax: daily.wind_speed_10m_max[i],
              });
            }
            setForecast(forecastDays);
          }
        } else {
          throw new Error("Failed to fetch weather data");
        }
      } catch (err) {
        setError(err.message || "Unable to load weather alerts");
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.location]);

  const weatherCodeMap = {
    0: "Clear",
    1: "Mostly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Heavy Rain",
    71: "Snow",
    73: "Snow",
    75: "Heavy Snow",
    80: "Showers",
    81: "Showers",
    82: "Heavy Showers",
    85: "Snow Showers",
    86: "Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };

  if (loading) {
    return (
      <div className="ngo-weather-container">
        <div className="weather-skeleton-header">
          <div className="skeleton-line"></div>
        </div>
        <div className="skeleton-line short"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ngo-weather-container">
        <div className="weather-error">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const severity = getSeverity(weather.weathercode);
  const suggestion = getPickupSuggestion(
    weather.weathercode,
    weather.windspeed
  );
  const condition = weatherCodeMap[weather.weathercode] || "Unknown";

  return (
    <div className="ngo-weather-container">
      <div className={`weather-alerts-card weather-${severity}`}>
        <div className="alerts-header">
          <div className="alerts-title-section">
            <span className="severity-icon">{getSeverityIcon(severity)}</span>
            <h3 className="alerts-title">Pickup Operations Weather</h3>
          </div>
          <span className={`severity-badge severity-${severity}`}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </span>
        </div>

        <div className="current-conditions">
          <div className="condition-main">
            <div className="temp-display">
              <span className="temperature">
                {Math.round(weather.temperature)}°C
              </span>
              <span className="condition-text">{condition}</span>
            </div>
          </div>

          <div className="condition-details">
            <div className="detail-row">
              <div className="detail-item">
                <FiWind className="detail-icon" />
                <div className="detail-info">
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">
                    {Math.round(weather.windspeed)} km/h
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <FiDroplet className="detail-icon" />
                <div className="detail-info">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">
                    {user?.location || "Raipur"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`pickup-suggestion suggestion-${severity}`}>
          <FiAlertTriangle className="suggestion-icon" />
          <div>
            <p className="suggestion-label">Suggested Action</p>
            <p className="suggestion-text">{suggestion}</p>
          </div>
        </div>

        {/* 3-Day Forecast */}
        {forecast && forecast.length > 0 && (
          <div className="forecast-section">
            <h4 className="forecast-title">3-Day Forecast</h4>
            <div className="forecast-grid">
              {forecast.map((day) => {
                const daySeverity = getSeverity(day.code);
                const dayName = ["Tomorrow", "Day 2", "Day 3"][day.day - 1];
                return (
                  <div
                    key={day.day}
                    className={`forecast-card forecast-${daySeverity}`}
                  >
                    <p className="forecast-day">{dayName}</p>
                    <span className="forecast-emoji">
                      {getSeverityIcon(daySeverity)}
                    </span>
                    <p className="forecast-condition">
                      {weatherCodeMap[day.code] || "Unknown"}
                    </p>
                    <div className="forecast-temps">
                      <span className="temp-high">
                        {Math.round(day.tempMax)}°
                      </span>
                      <span className="temp-low">
                        {Math.round(day.tempMin)}°
                      </span>
                    </div>
                    <p className="forecast-wind">
                      💨 {Math.round(day.windMax)} km/h
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="safety-tips">
          <h4 className="tips-title">🛡️ Safety Checklist</h4>
          <ul className="tips-list">
            <li>
              {severity === "severe"
                ? "❌ Do not attempt pickups"
                : "✅ Standard protective gear"}
            </li>
            <li>
              {Math.round(weather.windspeed) > 30
                ? "⚠️ Use secure containers"
                : "✅ Standard containers safe"}
            </li>
            <li>
              {[45, 48].includes(weather.weathercode)
                ? "🔦 Use lights and flags"
                : "✅ Standard visibility"}
            </li>
            <li>
              {[65, 75, 82, 86].includes(weather.weathercode)
                ? "☔ Waterproof covers required"
                : "✅ Standard cover sufficient"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NGOWeatherAlerts;
