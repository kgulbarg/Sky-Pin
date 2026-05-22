import React from "react";
import "../styles/forecastCard.css";

import { getWeatherUI } from "../utils/weatherMappings.js";

function formatForecastDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T12:00:00`);

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

function ForecastCard({ location, forecast, onBackToCurrent, onSearchAgain }) {
  const daily = forecast?.daily || [];

  return (
    <section id="weatherPage" aria-live="polite">
      <div id="weatherResult" className="forecast-result">
        <div className="forecast-actions">
          <button
            className="back-button"
            type="button"
            aria-label="Back to current weather"
            onClick={onBackToCurrent}
          >
            &#9664;
          </button>

          <button
            className="search-button"
            type="button"
            onClick={onSearchAgain}
          >
            New search
          </button>
        </div>

        <div className="weather-header-row">
          <div className="weather-text">
            <p className="weather-kicker">Weather results</p>
            <h2>5-Day Forecast</h2>
            <p className="weather-location">{location}</p>
          </div>
        </div>

        <div className="forecast-strip">
          {daily.map((day) => {
            const weatherUI = getWeatherUI(day.weather_code, true);

            return (
              <article className="forecast-day" key={day.date}>
                <p className="forecast-date">{formatForecastDate(day.date)}</p>
                <img src={weatherUI.iconUrl} alt={weatherUI.label} />
                <h3>{weatherUI.label}</h3>
                <p className="forecast-temp">
                  <strong>{day.temperature_2m_max}°</strong>
                  <span>{day.temperature_2m_min}°</span>
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
    </section>
  );
}

export default ForecastCard;