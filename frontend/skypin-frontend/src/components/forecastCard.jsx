import "../styles/forecastCard.css";

import DateRangeForm from "./dateRangeForm.jsx";
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

function ForecastCard({
  location,
  forecast,
  onBackToCurrent,
  onSearchAgain,
  title = "5-Day Forecast",
  showDateRangeForm = false,
  onToggleDateRange,
  dateRangeStart,
  dateRangeEnd,
  onDateRangeStartChange,
  onDateRangeEndChange,
  onDateRangeSubmit,
  isDateRangeLoading = false,
  dateRangeError = "",
  error = "",
}) {
  const daily = forecast?.daily || [];
  const units = forecast?.daily_units || {};

  return (
    <section id="weatherPage" aria-live="polite">
      <div id="weatherResult" className="forecast-result">
        <div className="forecast-actions">
          <button
            className="action-button"
            type="button"
            aria-label="Back to current weather"
            onClick={onBackToCurrent}
          >
            &#9664;
          </button>

          <button
            className="action-button"
            type="button"
            onClick={onSearchAgain}
          >
            New search
          </button>

          <button
            className="action-button"
            type="button"
            onClick={onBackToCurrent}
          >
            Current weather
          </button>

          <button
            className="action-button"
            type="button"
            onClick={onToggleDateRange}
          >
            {showDateRangeForm ? "Hide date range" : "View date range"}
          </button>
        </div>

        {showDateRangeForm ? (
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

        <div className="weather-header-row">
          <div className="weather-text">
            <p className="weather-kicker">Weather results</p>
            <h2>{title}</h2>
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
                  <strong>
                    {day.temperature_2m_max}
                    {units.temperature_2m_max ? ` ${units.temperature_2m_max}` : null}
                  </strong>
                  <span>
                    {day.temperature_2m_min}
                    {units.temperature_2m_min ? ` ${units.temperature_2m_min}` : null}
                  </span>
                </p>
                <dl>
                  <div>
                    <dt>Rain</dt>
                    <dd>
                      {day.rain_sum ?? 0}
                      {units.rain_sum ? ` ${units.rain_sum}` : units.precipitation ? ` ${units.precipitation}` : null}
                    </dd>
                  </div>
                  <div>
                    <dt>Wind</dt>
                    <dd>
                      {day.wind_speed_10m_max ?? 0}
                      {units.wind_speed_10m_max ? ` ${units.wind_speed_10m_max}` : units.wind_speed_10m ? ` ${units.wind_speed_10m}` : null}
                    </dd>
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