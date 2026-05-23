import { useState } from "react";
import WeatherCard from "./components/weatherCard.jsx";
import ForecastCard from "./components/forecastCard.jsx";
import "./App.css";

function App() {
  const apiBaseUrl = `http://localhost:${__BACKEND_PORT__}`;

  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchPayload, setSearchPayload] = useState(null);
  const [view, setView] = useState("form");
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const isLocationPayloadValid = ({ city, county, state, country, postalcode }) => {
    const hasCountry = country.trim() !== "";
    const hasPostalCode = postalcode.trim() !== "";
    const hasCity = city.trim() !== "";
    const hasState = state.trim() !== "";
    const hasCounty = county.trim() !== "";

    return hasCountry && (hasPostalCode || (hasCity && (hasState || hasCounty)));
  };

  const isValid = isLocationPayloadValid({
    city,
    county,
    state,
    country,
    postalcode,
  });

  const loadWeatherForPayload = async (payload) => {
    setError("");
    setView("form");
    setWeather(null);
    setForecast(null);
    setLocation(null);
    setSearchPayload(payload);
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
      setView("current");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setView("form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setError("");
    setIsLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setSearchPayload(payload);
          await loadWeatherForCoordinates(payload);
        } catch (err) {
          setError(err.message || "Something went wrong.");
          setView("form");
        } finally {
          setIsLocationLoading(false);
        }
      },
      () => {
        setError("Location access was denied or unavailable.");
        setIsLocationLoading(false);
      }
    );
  };

  const loadWeatherForCoordinates = async ({ latitude, longitude }) => {
    setError("");
    setView("form");
    setWeather(null);
    setForecast(null);
    setLocation("Your current location");
    setIsLocationLoading(true);

    try {
      const weatherResponse = await fetch(`${apiBaseUrl}/api/weather`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const weatherResult = await weatherResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(weatherResult.error || "Failed to fetch weather.");
      }

      setWeather(weatherResult);
      setView("current");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setView("form");
      setSearchPayload(null);
    } finally {
      setIsLocationLoading(false);
    }
  };

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

    if (!isLocationPayloadValid(payload)) {
      setError(
        "Provide country with postal code, or country with city and state or county"
      );
      return;
    }

    await loadWeatherForPayload(payload);
  };

  const handleSearchAgain = () => {
    setView("form");
    setWeather(null);
    setForecast(null);
    setLocation(null);
    setError("");
    setSearchPayload(null);
  };

  const handleSeeForecast = async () => {
    if (!searchPayload) {
      setError("Search again to load the forecast.");
      return;
    }

    setError("");
    setIsForecastLoading(true);

    try {
      const forecastResponse = await fetch(`${apiBaseUrl}/api/forecast5day`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchPayload),
      });

      const forecastResult = await forecastResponse.json();

      if (!forecastResponse.ok) {
        throw new Error(forecastResult.error || "Failed to fetch forecast.");
      }

      setForecast(forecastResult.forecast);
      setLocation(forecastResult.location.display_name);
      setView("forecast");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setView("current");
    } finally {
      setIsForecastLoading(false);
    }
  };

  return (
    <>
      <section id="center">
        {view === "form" ? (
          <div className="two-column">
            <aside className="left-column">
              <img src="/logo_no_bg.webp" alt="SkyPin logo" className="logo" />
              <button
                type="button"
                className="location-button"
                onClick={handleUseCurrentLocation}
                disabled={isLocationLoading || isLoading}
              >
                {isLocationLoading
                  ? "Finding your location..."
                  : "Get weather at your location"}
              </button>
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
                        {country.trim() !== "" &&
                        city.trim() !== "" &&
                        (state.trim() !== "" || county.trim() !== "")
                          ? "✓"
                          : "◯"}
                      </span>{" "}
                      &nbsp;Country + City + State or County
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
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
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
          <>
            {view === "current" && (
              <WeatherCard
                location={location}
                weather={weather}
                error={error}
                onSearchAgain={handleSearchAgain}
                onSeeForecast={handleSeeForecast}
                isForecastLoading={isForecastLoading}
              />
            )}

            {view === "forecast" && (
              <ForecastCard
                location={location}
                forecast={forecast}
                onBackToCurrent={() => setView("current")}
                onSearchAgain={handleSearchAgain}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}

export default App;
