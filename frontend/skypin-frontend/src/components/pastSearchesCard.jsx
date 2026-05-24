import "../styles/pastSearchesCard.css";

import { BsClockHistory, BsGeoAltFill } from "react-icons/bs";

function formatSearchTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().slice(0, 16).replace("T", " ");
}

function buildLocationLabel(search) {
  const parts = [
    search.city,
    search.state,
    search.cunty,
    search.country,
    search.pincode,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "User's physical location";
}

function PastSearchesCard({
  searches = [],
  isLoading = false,
  error = "",
  onSearchAgain,
}) {
  return (
    <section id="searchesPage" aria-live="polite">
      <div id="searchesResult" className="past-searches-result">
        <div className="result-location-row">
          <h3 aria-hidden="true" style={{ color: "#ffffff" }}>
            <BsClockHistory /> &nbsp;Past Searches
          </h3>
        </div>

        <div className="weather-actions">
          <button
            className="action-button"
            type="button"
            onClick={onSearchAgain}
          >
            Back to search
          </button>
        </div>

        {error ? <p className="weather-error">{error}</p> : null}

        {isLoading ? (
          <p className="past-searches-status">Loading past searches...</p>
        ) : null}

        {!isLoading && searches.length === 0 ? (
          <div className="past-searches-empty">
            <p>No past searches yet.</p>
            <p>
              Your search history will appear here after you look up weather.
            </p>
          </div>
        ) : null}

        {!isLoading && searches.length > 0 ? (
          <div className="past-searches-table-wrap">
            <table className="past-searches-table">
              <thead>
                <tr>
                  <th>Search Time (UTC)</th>
                  <th>Location</th>
                  <th>Coordinates</th>
                  <th>Date Range</th>
                  <th>Notes</th>
                  <th>Last updated</th>
                </tr>
              </thead>
              <tbody>
                {searches.map((search) => (
                  <tr key={search.id}>
                    <td>{formatSearchTime(search.search_time)}</td>
                    <td>
                      <span className="past-searches-location">
                        <BsGeoAltFill /> {buildLocationLabel(search)}
                      </span>
                    </td>
                    <td>
                      {search.latitude != null && search.longitude != null
                        ? `${search.latitude.toFixed(2)}, ${search.longitude.toFixed(2)}`
                        : "-"}
                    </td>
                    <td>
                      {search.start_date || search.end_date
                        ? `${search.start_date?.slice(0, 10) || "-"} to ${search.end_date?.slice(0, 10) || "-"}`
                        : "-"}
                    </td>
                    
                    <td>{search.user_notes || "-"}</td>
                    <td>{formatSearchTime(search.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default PastSearchesCard;
