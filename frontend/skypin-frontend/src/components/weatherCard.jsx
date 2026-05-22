import "../styles/weatherCard.css";

import { getWeatherUI } from "../utils/weatherMappings.js";

function WeatherCard({
  location,
  weather,
  error,
  onSearchAgain,
  onSeeForecast,
  isForecastLoading = false
}) {
  const current = weather?.current;
  const units = weather?.current_units;

  const weatherUI = getWeatherUI(
    current?.weather_code,
    current?.is_day === 1
  );

  return (
    <section id="weatherPage" aria-live="polite">
      <div id="weatherResult">
        <button
          className="back-button"
          type="button"
          aria-label="Return to search"
          onClick={onSearchAgain}
        >
          New search
        </button>
        &nbsp;&nbsp;&nbsp;
        <button
          className="forecast-button"
          type="button"
          onClick={onSeeForecast}
          disabled={isForecastLoading}
        >
          {isForecastLoading ? "Loading 5-day forecast..." : "See 5-day forecast"}
        </button>

        <div className="weather-header-row">
          <div className="weather-text">
            <p className="weather-kicker">Weather results</p>
            <h2>Current Weather</h2>
            <p className="weather-location">{location}</p>
          </div>

          <div className="weather-visual">
            <img
              src={weatherUI.iconUrl}
              alt={weatherUI.label}
              className="meteocon"
            />
            <p>{weatherUI.label}</p>
          </div>
        </div>

        {error ? <p className="weather-error">{error}</p> : null}

        <div className="weather-grid">
          <article>
            <span>Temperature</span>
            <strong>
              {current?.temperature_2m} &nbsp;
              {units?.temperature_2m}
            </strong>
          </article>

          <article>
            <span>Feels like</span>
            <strong>
              {current?.apparent_temperature} &nbsp;
              {units?.apparent_temperature}
            </strong>
          </article>

          <article>
            <span>Wind</span>
            <strong>
              {current?.wind_speed_10m} &nbsp;
              {units?.wind_speed_10m}
            </strong>
          </article>

          <article>
            <span>Precipitation</span>
            <strong>
              {current?.precipitation} &nbsp;
              {units?.precipitation}
            </strong>
          </article>
        </div>
      </div>
    </section>
  );
}

export default WeatherCard;