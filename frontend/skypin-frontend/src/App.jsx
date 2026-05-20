import { useState } from "react";
import "./App.css";

function App() {
  const apiBaseUrl = `http://localhost:${__BACKEND_PORT__}`;

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  const isValid =
    postalcode.trim() !== "" || (city.trim() !== "" && country.trim() !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      street: (formData.get("street") || "").toString().trim(),
      city: (formData.get("city") || "").toString().trim(),
      county: (formData.get("county") || "").toString().trim(),
      state: (formData.get("state") || "").toString().trim(),
      country: (formData.get("country") || "").toString().trim(),
      postalcode: (formData.get("postalcode") || "").toString().trim(),
    };

    const hasPostalCode = payload.postalcode !== "";
    const hasCityAndCountry = payload.city !== "" && payload.country !== "";

    setWeather(null);
    setLocation(null);

    if (!hasPostalCode && !hasCityAndCountry) {
      setError("Provide either postal code, or both city and country");
      return;
    }

    setError("");
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
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section id="center">
        <div>
          <form id="addressForm" onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                <h1>Enter your address</h1>
              </legend>

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
                  Please provide at least one of the following:
                </div>
                <div style={{ marginBottom: "0rem", display: "flex" }}>
                  <span>{postalcode.trim() !== "" ? "✓" : "◯"}</span>{" "}
                  &nbsp;Postal code
                </div>
                <div style={{ display: "flex" }}>
                  <span>
                    {city.trim() !== "" && country.trim() !== "" ? "✓" : "◯"}
                  </span>{" "}
                  &nbsp;City AND country
                </div>
              </div>

              <label htmlFor="street">House No & Street Name</label>
              <input
                type="text"
                id="street"
                name="street"
                placeholder="House No & Street Name"
              />
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <label htmlFor="county">County / District</label>
              <input
                type="text"
                id="county"
                name="county"
                placeholder="County / District"
              />
              <label htmlFor="state">State / Region</label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="State / Region"
              />
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <label htmlFor="postalcode">Postal Code</label>
              <input
                type="text"
                id="postalcode"
                name="postalcode"
                placeholder="Postal Code"
                value={postalcode}
                onChange={(e) => setPostalcode(e.target.value)}
              />
            </fieldset>

            <button type="submit" disabled={!isValid || isLoading}>
              {isLoading ? "Loading weather..." : "Get Weather"}
            </button>

            <p id="error">{error}</p>
          </form>

          {weather && (
            <section id="weatherResult" aria-live="polite">
              <h2>Current Weather</h2>
              <p>{location}</p>
              <p>
                Temperature: {weather.current?.temperature_2m}
                {weather.current_units?.temperature_2m}
              </p>
              <p>
                Feels like: {weather.current?.apparent_temperature}
                {weather.current_units?.apparent_temperature}
              </p>
              <p>
                Wind: {weather.current?.wind_speed_10m}
                {weather.current_units?.wind_speed_10m}
              </p>
              <p>Condition code: {weather.current?.weather_code}</p>
            </section>
          )}
        </div>
      </section>
    </>
  );
}

export default App;
