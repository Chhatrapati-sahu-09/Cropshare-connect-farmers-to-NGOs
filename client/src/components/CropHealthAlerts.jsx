import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { getMyCrops } from "../services/api.js";
import "./CropHealthAlerts.css";
import { FiAlertCircle, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

const CropHealthAlerts = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Crop-specific vulnerabilities
  const cropVulnerabilities = {
    Vegetables: {
      highHumidity: "may cause spoilage for vegetables",
      rain: "cover vegetables to prevent water damage",
      heat: "provide shade for heat-sensitive vegetables",
      cold: "frost protection needed for tender crops",
    },
    Grains: {
      highHumidity: "moisture content rising - risk of mold",
      rain: "cover grains immediately - water damage risk",
      heat: "ensure proper ventilation for storage",
      cold: "grains are stable in cold conditions",
    },
    Fruits: {
      highHumidity: "high humidity causes fruit rot",
      rain: "avoid water logging - drain fields immediately",
      heat: "increased ripening - monitor carefully",
      cold: "frost risk - cover sensitive fruits",
    },
    Seeds: {
      highHumidity: "moisture threatens seed viability",
      rain: "protect seeds from water exposure",
      heat: "seeds need cool, dry storage",
      cold: "store in insulated area to prevent freezing",
    },
  };

  const getWeatherAlerts = (weatherCode, temp, humidity) => {
    const weatherAlerts = [];

    // Rain warnings
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      weatherAlerts.push({
        type: "rain",
        severity: [65, 75, 82, 86].includes(weatherCode) ? "high" : "medium",
        message: "Rain expected",
      });
    }

    // High humidity (inferred from rain/fog)
    if (
      [45, 48].includes(weatherCode) ||
      (weatherCode >= 80 && weatherCode <= 82)
    ) {
      weatherAlerts.push({
        type: "humidity",
        severity: "medium",
        message: "High humidity conditions",
      });
    }

    // Extreme temperature
    if (temp > 35) {
      weatherAlerts.push({
        type: "heat",
        severity: "high",
        message: "Extreme heat warning",
      });
    }

    if (temp < 5) {
      weatherAlerts.push({
        type: "cold",
        severity: "high",
        message: "Frost risk warning",
      });
    }

    return weatherAlerts;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch farmer's crops
        const farmerCrops = await getMyCrops().catch(() => []);
        setCrops(farmerCrops);

        // Fetch weather data
        const location = user?.location || "Raipur";
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`
        ).then((r) => r.json());

        if (geoRes.results?.length > 0) {
          const { latitude, longitude } = geoRes.results[0];

          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m&timezone=auto`
          ).then((r) => r.json());

          if (weatherRes.current) {
            setWeather(weatherRes.current);
          }
        }
      } catch (error) {
        console.error("Error loading crop health data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (!crops.length || !weather) return;

    const generatedAlerts = [];

    // Get weather-based alerts
    const weatherAlerts = getWeatherAlerts(
      weather.weather_code,
      weather.temperature_2m,
      weather.relative_humidity_2m
    );

    // Generate crop-specific alerts
    crops.forEach((crop) => {
      const vulns = cropVulnerabilities[crop.category];
      if (!vulns) return;

      weatherAlerts.forEach((alert) => {
        let message = "";
        let severity = alert.severity;

        switch (alert.type) {
          case "humidity":
            message = `High humidity — ${vulns.highHumidity}`;
            break;
          case "rain":
            message = `Rain expected — ${vulns.rain}`;
            break;
          case "heat":
            message = `Extreme heat — ${vulns.heat}`;
            break;
          case "cold":
            message = `Cold weather — ${vulns.cold}`;
            break;
          default:
            return;
        }

        generatedAlerts.push({
          id: `${crop._id}-${alert.type}`,
          cropName: crop.title,
          cropCategory: crop.category,
          message,
          severity,
          type: alert.type,
        });
      });
    });

    // Add positive message if no alerts
    if (generatedAlerts.length === 0 && crops.length > 0) {
      generatedAlerts.push({
        id: "positive",
        cropName: "All crops",
        message: "Good weather for storage today",
        severity: "good",
        type: "positive",
      });
    }

    setAlerts(generatedAlerts);
  }, [crops, weather]);

  if (loading) {
    return (
      <div className="health-alerts-section">
        <div className="alerts-header">
          <h3>Crop Health Alerts</h3>
        </div>
        <div className="alerts-loading">Loading crop alerts...</div>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="health-alerts-section">
        <div className="alerts-header">
          <h3>Crop Health Alerts</h3>
        </div>
        <div className="alerts-empty">
          <p>Add crops to receive health alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="health-alerts-section">
      <div className="alerts-header">
        <h3>Crop Health Alerts</h3>
        <span className="alerts-count">{alerts.length} alerts</span>
      </div>

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
            <div className="alert-icon">
              {alert.severity === "good" ? (
                <FiCheckCircle />
              ) : (
                <FiAlertCircle />
              )}
            </div>

            <div className="alert-content">
              <p className="alert-message">{alert.message}</p>
              {alert.cropName && alert.cropName !== "All crops" && (
                <span className="alert-crop">
                  <strong>{alert.cropName}</strong> • {alert.cropCategory}
                </span>
              )}
            </div>

            <div className="alert-status">
              <span className={`badge badge-${alert.severity}`}>
                {alert.severity === "good"
                  ? "Safe"
                  : alert.severity.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {weather && (
        <div className="weather-summary">
          <div className="weather-stat">
            <span className="stat-label">Temperature</span>
            <span className="stat-value">{weather.temperature_2m}°C</span>
          </div>
          <div className="weather-stat">
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{weather.relative_humidity_2m}%</span>
          </div>
          <div className="weather-stat">
            <span className="stat-label">Location</span>
            <span className="stat-value">{user?.location || "Raipur"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropHealthAlerts;
