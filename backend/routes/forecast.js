const express = require("express");

const router = express.Router();

const {
  getForecast
} = require("../services/forecastService");

router.post("/", async (req, res) => {

  try {

    /* Empty body */
    if (
      !req.body ||
      Object.keys(req.body).length === 0
    ) {
      return res.status(400).json({
        error: "Request body is required."
      });
    }

    const result = await getForecast(req.body);

    res.json(result);

  } catch (err) {

    console.error(err.message);

    if (err.message === "Provide at least one valid location field.") {
      return res.status(400).json({
        error: err.message
      });
    }

    if (err.message === "Location not found.") {
      return res.status(404).json({
        error: err.message
      });
    }

    res.status(500).json({
      error: err.message || "Forecast failed."
    });

  }

});

module.exports = router;


/*
forecast example request body:

{
    "city" : "Norristown",
    "county": "PA", 
    "state" : "PA",
    "country" : "United States"
}

forecast example response:

{
    "location": {
        "display_name": "Norristown, Montgomery County, Pennsylvania, 19401, United States",
        "latitude": 40.1148787,
        "longitude": -75.3433705
    },
    "weather": {
        "coordinates": {
            "latitude": 40.11179,
            "longitude": -75.36108
        },
        "generationtime_ms": 2.0105838775634766,
        "elevation": 39,
        "timezone": {
            "name": "America/New_York",
            "abbreviation": "GMT-4",
            "utc_offset_seconds": -14400
        },
        "current_units": {
            "time": "iso8601",
            "interval": "seconds",
            "precipitation": "mm",
            "rain": "mm",
            "temperature_2m": "°C",
            "relative_humidity_2m": "%",
            "weather_code": "wmo code",
            "wind_speed_10m": "km/h",
            "wind_direction_10m": "°",
            "wind_gusts_10m": "km/h",
            "cloud_cover": "%",
            "pressure_msl": "hPa",
            "surface_pressure": "hPa",
            "showers": "mm",
            "snowfall": "cm",
            "is_day": "",
            "apparent_temperature": "°C"
        },
        "current": {
            "time": "2026-05-21T00:00",
            "interval": 900,
            "temperature_2m": 19.9,
            "apparent_temperature": 22,
            "precipitation": 0,
            "rain": 0,
            "showers": 0,
            "snowfall": 0,
            "relative_humidity_2m": 89,
            "weather_code": 2,
            "cloud_cover": 59,
            "surface_pressure": 1013.2,
            "pressure_msl": 1017.8,
            "wind_speed_10m": 5.2,
            "wind_direction_10m": 304,
            "wind_gusts_10m": 22.3,
            "is_day": 0
        }
    }
}

*/
