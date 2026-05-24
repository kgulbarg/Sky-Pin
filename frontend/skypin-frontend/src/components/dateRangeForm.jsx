import "../styles/dateRangePanel.css";

function DateRangeForm({
  title = "Day-wise weather data for custom date range",
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  isLoading = false,
  submitLabel = "Get weather data",
  error = "",
}) {
  return (
    <form className="date-range-panel" onSubmit={onSubmit}>
      <div className="date-range-copy">
        <p className="weather-kicker">Date range search</p>
        <h3>{title}</h3>
        <p className="date-range-help">
          For this location, choose the dates of your interest to get day-wise weather data for.<br/>
          Available date range is 60 days in the past to 15 days in the future.
        </p>
      </div>

      <div className="date-range-fields">
        <div className="date-range-field">
          <label htmlFor="startDate">Start date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
        </div>

        <div className="date-range-field">
          <label htmlFor="endDate">End date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
        </div>
      </div>

      {error ? (
        <p className="date-range-error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className="action-button date-range-submit"
        type="submit"
        disabled={isLoading || !startDate || !endDate}
      >
        {isLoading ? "Loading range..." : submitLabel}
      </button>
    </form>
  );
}

export default DateRangeForm;