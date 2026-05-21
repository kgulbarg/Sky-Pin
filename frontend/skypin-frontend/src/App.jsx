import { useState } from "react";
import "./App.css";

function App() {
  const apiBaseUrl = `http://localhost:${__BACKEND_PORT__}`;

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [view, setView] = useState("form");

  const hasCity = city.trim() !== "";
  const hasState = state.trim() !== "";
  const hasCountry = country.trim() !== "";
  const hasPostalcode = postalcode.trim() !== "";

  const isValid =
    hasCountry && (hasPostalcode || (hasCity && hasState));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      city: (formData.get("city") || "").toString().trim(),
      county: (formData.get("county") || "").toString().trim(),
      state: (formData.get("state") || "").toString().trim(),
      country: (formData.get("country") || "").toString().trim(),
      postalcode: (formData.get("postalcode") || "").toString().trim(),
    };

    const hasCountry = payload.country !== "";
    const hasPostalCode = payload.postalcode !== "";
    const hasCityAndState = payload.city !== "" && payload.state !== "";

    if (!hasCountry || (!hasPostalCode && !hasCityAndState)) {
      setError(
        "Provide country with postal code, or country with city and state"
      );
      return;
    }

    setError("");
    setView("form");
    setWeather(null);
    setLocation(null);
    setIsLoading(true);

    try {
      const forecastResponse = await fetch(`${apiBaseUrl}/api/forecast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const forecastResult = await forecastResponse.json();

      if (!forecastResponse.ok) {
        throw new Error(forecastResult.error || "Failed to fetch forecast.");
      }

      setLocation(forecastResult.location.display_name);

      setWeather(forecastResult.weather);
      setView("results");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setView("form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setView("form");
    setWeather(null);
    setLocation(null);
    setError("");
  };

  return (
    <>
      <section id="center">
        {view === "form" ? (
          <div className="two-column">
            <aside className="left-column">
              <img src="/logo_no_bg.webp" alt="SkyPin logo" className="logo" />
            </aside>

            <main className="right-column">
              <form id="addressForm" onSubmit={handleSubmit}>
                <fieldset>
                  <legend>Enter your address</legend>

                  <div
                    style={{
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                      padding: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "0rem",
                        color: isValid ? "green" : "red",
                        display: "flex",
                      }}
                    >
                      Please provide one of the following:
                    </div>
                    <div style={{ marginBottom: "0rem", display: "flex" }}>
                      <span>
                        {country.trim() !== "" && postalcode.trim() !== ""
                          ? "✓"
                          : "◯"}
                      </span>{" "}
                      &nbsp;Country + Postal code
                    </div>
                    <div style={{ display: "flex" }}>
                      <span>
                        {country.trim() !== "" && city.trim() !== "" && state.trim() !== ""
                          ? "✓"
                          : "◯"}
                      </span>{" "}
                      &nbsp;Country + City + State
                    </div>
                  </div>

                  <div className="form-row">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="county">County / District</label>
                    <input
                      type="text"
                      id="county"
                      name="county"
                      placeholder="County / District"
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="state">State / Region</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="State / Region"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="postalcode">Postal Code</label>
                    <input
                      type="text"
                      id="postalcode"
                      name="postalcode"
                      placeholder="Postal Code"
                      value={postalcode}
                      onChange={(e) => setPostalcode(e.target.value)}
                    />
                  </div>
                </fieldset>

                <button type="submit" disabled={!isValid || isLoading}>
                  {isLoading ? "Loading weather..." : "Get Weather"}
                </button>

                <p id="error" style={{ textAlign: "center" }}>
                  {error}
                </p>
              </form>
            </main>
          </div>
        ) : (
          <section id="weatherPage" aria-live="polite">
            <div id="weatherResult">
              <img
                src="/logo_no_bg.webp"
                alt="Sky Pin logo"
                className="weather-logo"
              />
              <button
                className="back-button"
                type="button"
                aria-label="Return to search"
                onClick={handleSearchAgain}
              >
                &#9664;
              </button>
              <p className="weather-kicker">Weather results</p>
              <h2>Current Weather</h2>
              <p className="weather-location">{location}</p>

              <div className="weather-grid">
                <article>
                  <span>Temperature</span>
                  <strong>
                    {weather.current?.temperature_2m} &nbsp;
                    {weather.current_units?.temperature_2m}
                  </strong>
                </article>
                <article>
                  <span>Feels like</span>
                  <strong>
                    {weather.current?.apparent_temperature} &nbsp;
                    {weather.current_units?.apparent_temperature}
                  </strong>
                </article>
                <article>
                  <span>Wind</span>
                  <strong>
                    {weather.current?.wind_speed_10m} &nbsp;
                    {weather.current_units?.wind_speed_10m}
                  </strong>
                </article>
                <article>
                  <span>Precipitation</span>
                  <strong>{weather.current?.precipitation} &nbsp;
                    {weather.current_units?.precipitation}</strong>
                </article>
              </div>
            </div>
          </section>
        )}
      </section>
    </>
  );
}

export default App;
