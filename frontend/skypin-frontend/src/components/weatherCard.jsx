import "../styles/weatherCard.css";

import DateRangeForm from "./dateRangeForm.jsx";
import RangeForecastCard from "./rangeForecastCard.jsx";
import { getWeatherUI } from "../utils/weatherMappings.js";

import { BsGeoAltFill } from "react-icons/bs";

function WeatherCard({
  location,
  weather,
  error,
  onSearchAgain,
  onSeeForecast,
  showDateRangeForm = false,
  onToggleDateRange,
  dateRangeStart,
  dateRangeEnd,
  onDateRangeStartChange,
  onDateRangeEndChange,
  onDateRangeSubmit,
  rangeForecast = null,
  rangeForecastTitle = "Day-wise weather data for custom date range",
  isForecastLoading = false,
  isDateRangeLoading = false,
  dateRangeError = "",
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
        <div className="result-location-row">
            <h3 aria-hidden="true"><BsGeoAltFill /> &nbsp;{location}</h3>
        </div>

        <div className="weather-actions">
          <button
            className="action-button"
            type="button"
            aria-label="Return to search"
            onClick={onSearchAgain}
          >
            New search
          </button>

          <button
            className="action-button"
            type="button"
            onClick={onSeeForecast}
            disabled={isForecastLoading}
          >
            {isForecastLoading ? "Loading 5-day forecast..." : "See 5-day forecast"}
          </button>

          <button
            className="action-button"
            type="button"
            onClick={onToggleDateRange}
          >
            {showDateRangeForm ? "Hide Date Range Search" : "View Date Range Search"}
          </button>
        </div>

        {showDateRangeForm && !rangeForecast ? (
          <DateRangeForm
            startDate={dateRangeStart}
            endDate={dateRangeEnd}
            onStartDateChange={onDateRangeStartChange}
            onEndDateChange={onDateRangeEndChange}
            onSubmit={onDateRangeSubmit}
            isLoading={isDateRangeLoading}
            error={dateRangeError}
          />
        ) : null}

        {rangeForecast ? null : (
          <>
            <div className="weather-header-row">
              <div className="weather-text">
                <p className="weather-kicker">Weather results</p>
                <h2>Current Weather</h2> <br/>
                <text class="weather-label">{weatherUI.label}</text>
              </div>

              <div className="weather-visual">
                <img
                  src={weatherUI.iconUrl}
                  alt={weatherUI.label}
                  className="meteocon"
                />
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
          </>
        )}

        <RangeForecastCard rangeForecast={rangeForecast} title={rangeForecastTitle} />
      </div>
    </section>
  );
}

export default WeatherCard;