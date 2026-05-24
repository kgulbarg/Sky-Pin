import "../styles/forecastCard.css";
import "../styles/rangeForecastCard.css";

import { getWeatherUI } from "../utils/weatherMappings.js";

function formatForecastDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T12:00:00`);

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function RangeForecastCard({ rangeForecast, title = "Day-wise weather data for custom date range" }) {
  if (!rangeForecast) {
    return null;
  }

  return (
    <div className="range-forecast-block">
      <div className="weather-text">
        <p className="weather-kicker">Date range results</p>
        <h3>{title}</h3>
      </div>

      <div className="forecast-strip forecast-strip--embedded">
        {(rangeForecast.daily || []).map((day) => {
          const weatherUI = getWeatherUI(day.weather_code, true);

          return (
            <article className="forecast-day" key={day.date}>
              <p className="forecast-date">{formatForecastDate(day.date)}</p>
              <img src={weatherUI.iconUrl} alt={weatherUI.label} />
              <h3>{weatherUI.label}</h3>
              <p className="forecast-temp">
                <strong>{day.temperature_2m_max}</strong>
                <span>{day.temperature_2m_min}</span>
              </p>
              <dl>
                <div>
                  <dt>Rain</dt>
                  <dd>{day.rain_sum ?? 0}</dd>
                </div>
                <div>
                  <dt>Wind</dt>
                  <dd>{day.wind_speed_10m_max ?? 0}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default RangeForecastCard;