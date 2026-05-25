import { useState } from "react";
import WeatherCard from "./components/weatherCard.jsx";
import ForecastCard from "./components/forecastCard.jsx";
import LocationMapCard from "./components/locationMapCard.jsx";
import PastSearchesCard from "./components/pastSearchesCard.jsx";
import "./App.css";

function getLocalDateString(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

function formatRangeDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T12:00:00`);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getRangeForecastTitle(startDate, endDate) {
  const formattedStart = formatRangeDate(startDate);
  const formattedEnd = formatRangeDate(endDate);

  if (!formattedStart || !formattedEnd) {
    return "Day-wise weather data for custom date range";
  }

  return (
    <>
      Day-wise weather data from
      <br />
      {formattedStart} to {formattedEnd}
    </>
  );
}

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
  const [mapLocation, setMapLocation] = useState(null);
  const [mapReturnView, setMapReturnView] = useState("current");
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showDateRangeForm, setShowDateRangeForm] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [isDateRangeLoading, setIsDateRangeLoading] = useState(false);
  const [dateRangeError, setDateRangeError] = useState("");
  const [forecastTitle, setForecastTitle] = useState("5-Day Forecast");
  const [rangeForecast, setRangeForecast] = useState(null);
  const [rangeForecastTitle, setRangeForecastTitle] = useState(
    "Day-wise weather data for custom date range",
  );
  const [pastSearches, setPastSearches] = useState([]);
  const [isPastSearchesLoading, setIsPastSearchesLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  const resetWeatherViews = () => {
    setWeather(null);
    setForecast(null);
    setRangeForecast(null);
    setLocation(null);
    setMapLocation(null);
    setForecastTitle("5-Day Forecast");
    setShowDateRangeForm(false);
    setDateRangeError("");
    setRangeForecastTitle("Day-wise weather data for custom date range");
  };

  const handleOpenMap = (locationData) => {
    if (
      !locationData ||
      locationData.latitude == null ||
      locationData.longitude == null
    ) {
      return;
    }

    setMapLocation(locationData);
    setMapReturnView(view);
    setView("map");
  };

  const handleCloseMap = () => {
    setView(mapReturnView);
  };

  const isLocationPayloadValid = ({
    city,
    county,
    state,
    country,
    postalcode,
  }) => {
    const hasCountry = country.trim() !== "";
    const hasPostalCode = postalcode.trim() !== "";
    const hasCity = city.trim() !== "";
    const hasState = state.trim() !== "";
    const hasCounty = county.trim() !== "";

    return (
      hasCountry && (hasPostalCode || (hasCity && (hasState || hasCounty)))
    );
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
    resetWeatherViews();
    setPastSearches([]);
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

      setLocation(forecastResult.location);
      setWeather(forecastResult.weather);
      setView("current");
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("Failed to fetch - Server down");
      } else {
        setError(err.message || "Something went wrong.");
      }
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
          if (err.message === "Failed to fetch") {
            setError("Failed to fetch - Server down");
          } else {
            setError(err.message || "Something went wrong.");
          }
          setView("form");
        } finally {
          setIsLocationLoading(false);
        }
      },
      () => {
        setError("Location access was denied or unavailable.");
        setIsLocationLoading(false);
      },
    );
  };

  const loadWeatherForCoordinates = async ({ latitude, longitude }) => {
    setError("");
    setView("form");
    resetWeatherViews();
    setPastSearches([]);
    setLocation({
      display_name: "Your current location",
      latitude,
      longitude,
    });
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
      if (err.message === "Failed to fetch") {
        setError("Failed to fetch - Server down");
      } else {
        setError(err.message || "Something went wrong.");
      }
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
        "Provide country with postal code, or country with city and state or county",
      );
      return;
    }

    await loadWeatherForPayload(payload);
  };

  const handleSearchAgain = () => {
    setView("form");
    resetWeatherViews();
    setError("");
    setSearchPayload(null);
    setDateRangeStart("");
    setDateRangeEnd("");
    setIsDateRangeLoading(false);
    setDateRangeError("");
    setPastSearches([]);
  };

  const handlePastSearches = async () => {
    setError("");
    setView("pastSearches");
    setIsPastSearchesLoading(true);
    setPastSearches([]);

    try {
      const response = await fetch(`${apiBaseUrl}/api/weather/searches`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load past searches.");
      }

      setPastSearches(result.searches || []);
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("Failed to fetch - Server down");
      } else {
        setError(err.message || "Something went wrong.");
      }
      setView("form");
    } finally {
      setIsPastSearchesLoading(false);
    }
  };

  const handleDownloadWeatherData = async () => {
    setError("");
    setIsDownloadLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/weather/export`);

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));

        throw new Error(result.error || "Failed to download weather data.");
      }

      const csvBlob = await response.blob();
      const objectUrl = window.URL.createObjectURL(csvBlob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = "weather-data.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("Failed to fetch - Server down");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleAddPastSearchNotes = async (search) => {
    const nextNotes = window.prompt(
      "Add notes for this search:",
      search.user_notes || "",
    );

    if (nextNotes === null) {
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/weather/searches/${search.id}/notes`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userNotes: nextNotes.trim() || null }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save notes.");
      }

      const savedSearch = result.search || null;
      const nextNoteValue =
        savedSearch?.user_notes ?? (nextNotes.trim() || null);

      setPastSearches((currentSearches) =>
        currentSearches.map((item) =>
          item.id === search.id
            ? {
                ...item,
                user_notes: nextNoteValue,
                updated_at: savedSearch?.updated_at ?? item.updated_at,
              }
            : item,
        ),
      );
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("Failed to fetch - Server down");
      } else {
        setError(err.message || "Something went wrong.");
      }
    }
  };

  const handleDeletePastSearch = async (search) => {
    const confirmed = window.confirm(
      "Delete this record and its related weather data?",
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/weather/searches/${search.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete past search.");
      }

      setPastSearches((currentSearches) =>
        currentSearches.filter((item) => item.id !== search.id),
      );
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("Failed to fetch - Server down");
      } else {
        setError(err.message || "Something went wrong.");
      }
    }
  };

  const loadForecastDays = async (payload) => {
    const forecastResponse = await fetch(`${apiBaseUrl}/api/forecastDays`, {
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

    return forecastResult;
  };

  const handleSeeForecast = async () => {
    if (!searchPayload) {
      setError("Search again to load the forecast.");
      return;
    }

    setError("");
    setIsForecastLoading(true);
    setShowDateRangeForm(false);
    setRangeForecast(null);
    setDateRangeError("");

    try {
      const forecastResult = await loadForecastDays(searchPayload);
      setForecast(forecastResult.forecast);
      setLocation(forecastResult.location);
      setForecastTitle("5-Day Forecast");
      setView("forecast");
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("Failed to fetch - Server down");
      } else {
        setError(err.message || "Something went wrong.");
      }
      setView("current");
    } finally {
      setIsForecastLoading(false);
    }
  };

  const handleToggleDateRange = () => {
    setError("");
    setDateRangeError("");
    setShowDateRangeForm((current) => {
      const nextState = !current;

      if (nextState && !dateRangeStart && !dateRangeEnd) {
        const startDate = getLocalDateString();
        setDateRangeStart(startDate);
        setDateRangeEnd(addDays(startDate, 4));
      }

      return nextState;
    });
  };

  const handleDateRangeSubmit = async (event) => {
    event.preventDefault();

    if (!searchPayload) {
      setError("Search again to load date range weather.");
      return;
    }

    if (!dateRangeStart || !dateRangeEnd) {
      setDateRangeError("Choose both a start date and an end date.");
      return;
    }

    setError("");
    setDateRangeError("");
    setIsDateRangeLoading(true);

    try {
      const forecastResult = await loadForecastDays({
        ...searchPayload,
        startDate: dateRangeStart,
        endDate: dateRangeEnd,
      });

      setShowDateRangeForm(false);

      if (view === "current") {
        setRangeForecast(forecastResult.forecast);
        setRangeForecastTitle(
          getRangeForecastTitle(dateRangeStart, dateRangeEnd),
        );
      } else {
        setForecast(forecastResult.forecast);
        setLocation(forecastResult.location);
        setForecastTitle(getRangeForecastTitle(dateRangeStart, dateRangeEnd));
        setView("forecast");
      }
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setDateRangeError("Failed to fetch - Server down");
      } else {
        setDateRangeError(err.message || "Something went wrong.");
      }
    } finally {
      setIsDateRangeLoading(false);
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
              <br />
              <button
                type="button"
                className="location-button"
                onClick={handlePastSearches}
                disabled={
                  isPastSearchesLoading || isLoading || isLocationLoading
                }
              >
                {isPastSearchesLoading
                  ? "Fetching history..."
                  : "Past Searches"}
              </button>
              <br />
              <button
                type="button"
                className="location-button"
                onClick={handleDownloadWeatherData}
                disabled={isDownloadLoading || isLoading || isLocationLoading}
              >
                {isDownloadLoading
                  ? "Downloading data..."
                  : "Download weather data (CSV)"}
              </button>
            </aside>

            <main className="right-column">
              <form id="addressForm" onSubmit={handleSubmit}>
                <fieldset>
                  <legend style={{ textAlign: "center" }}>
                    Enter an address
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
                      Please provide one of the following:
                    </div>
                    <div style={{ marginBottom: "0rem", display: "flex" }}>
                      <span>
                        {country.trim() !== "" && postalcode.trim() !== ""
                          ? "✓"
                          : "✗"}
                      </span>{" "}
                      &nbsp;Country + Postal code
                    </div>
                    <div style={{ display: "flex" }}>
                      <span>
                        {country.trim() !== "" &&
                        city.trim() !== "" &&
                        (state.trim() !== "" || county.trim() !== "")
                          ? "✓"
                          : "✗"}
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
                dateRangeError={dateRangeError}
                onSearchAgain={handleSearchAgain}
                onSeeForecast={handleSeeForecast}
                onViewMap={handleOpenMap}
                showDateRangeForm={showDateRangeForm}
                onToggleDateRange={handleToggleDateRange}
                dateRangeStart={dateRangeStart}
                dateRangeEnd={dateRangeEnd}
                onDateRangeStartChange={setDateRangeStart}
                onDateRangeEndChange={setDateRangeEnd}
                onDateRangeSubmit={handleDateRangeSubmit}
                rangeForecast={rangeForecast}
                rangeForecastTitle={rangeForecastTitle}
                isForecastLoading={isForecastLoading}
                isDateRangeLoading={isDateRangeLoading}
              />
            )}

            {view === "forecast" && (
              <ForecastCard
                location={location}
                forecast={forecast}
                error={error}
                onBackToCurrent={() => setView("current")}
                onSearchAgain={handleSearchAgain}
                onViewMap={handleOpenMap}
                title={forecastTitle}
                showDateRangeForm={showDateRangeForm}
                onToggleDateRange={handleToggleDateRange}
                dateRangeStart={dateRangeStart}
                dateRangeEnd={dateRangeEnd}
                onDateRangeStartChange={setDateRangeStart}
                onDateRangeEndChange={setDateRangeEnd}
                onDateRangeSubmit={handleDateRangeSubmit}
                isDateRangeLoading={isDateRangeLoading}
                dateRangeError={dateRangeError}
              />
            )}

            {view === "map" && (
              <LocationMapCard
                location={mapLocation}
                onClose={handleCloseMap}
              />
            )}

            {view === "pastSearches" && (
              <PastSearchesCard
                searches={pastSearches}
                isLoading={isPastSearchesLoading}
                error={error}
                onSearchAgain={handleSearchAgain}
                onAddNotes={handleAddPastSearchNotes}
                onDeleteSearch={handleDeletePastSearch}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}

export default App;
