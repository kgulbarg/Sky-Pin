const express = require("express");

const router = express.Router();

const {
  getForecastDays
} = require("../services/forecastDaysService");
const {
  LOCATION_INPUT_ERROR_MESSAGE
} = require("../services/geocoordService");
const {
  buildFiveDayWeatherDailyRows,
  recordWeatherSearchWithDailyRows,
  getTodayDateString,
} = require("../services/weatherPersistenceService");

function getDefaultForecastEndDate() {
  return getTodayDateString(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000));
}

router.post("/", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is required."
      });
    }

    const result = await getForecastDays(req.body);

    const startDate = req.body.startDate || getTodayDateString();
    const endDate = req.body.endDate || getDefaultForecastEndDate();

    await recordWeatherSearchWithDailyRows({
      city: req.body.city || null,
      state: req.body.state || null,
      cunty: req.body.county || null,
      country: req.body.country || null,
      pincode: req.body.postalcode || null,
      latitude: result.location.latitude,
      longitude: result.location.longitude,
      startDate,
      endDate,
    }, buildFiveDayWeatherDailyRows(result.forecast));

    res.json(result);
  } catch (err) {
    console.error(err.message);

    if (err.message === LOCATION_INPUT_ERROR_MESSAGE) {
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
      error: err.message || "5-day forecast failed."
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
    "forecast": {
        "coordinates": {
            "latitude": 40.11179,
            "longitude": -75.36108
        },
        "generationtime_ms": 1424.089789390564,
        "elevation": 39,
        "timezone": {
            "name": "America/New_York",
            "abbreviation": "GMT-4",
            "utc_offset_seconds": -14400
        },
        "daily_units": {
            "time": "iso8601",
            "weather_code": "wmo code",
            "temperature_2m_max": "°C",
            "temperature_2m_min": "°C",
            "apparent_temperature_max": "°C",
            "apparent_temperature_min": "°C",
            "daylight_duration": "s",
            "sunset": "iso8601",
            "sunrise": "iso8601",
            "wind_speed_10m_max": "km/h",
            "precipitation_probability_max": "%",
            "sunshine_duration": "s",
            "uv_index_max": "",
            "uv_index_clear_sky_max": "",
            "rain_sum": "mm",
            "showers_sum": "mm",
            "snowfall_sum": "cm",
            "precipitation_sum": "mm",
            "precipitation_hours": "h",
            "wind_gusts_10m_max": "km/h",
            "wind_direction_10m_dominant": "°",
            "shortwave_radiation_sum": "MJ/m²",
            "et0_fao_evapotranspiration": "mm"
        },
        "daily": [
            {
                "date": "2026-05-21",
                "weather_code": 65,
                "temperature_2m_max": 19.7,
                "temperature_2m_min": 12.7,
                "apparent_temperature_max": 21.2,
                "apparent_temperature_min": 11,
                "daylight_duration": 52494.76,
                "sunset": "2026-05-21T20:15",
                "sunrise": "2026-05-21T05:40",
                "wind_speed_10m_max": 15.5,
                "precipitation_probability_max": 82,
                "sunshine_duration": 3794.5,
                "uv_index_max": 2.1,
                "uv_index_clear_sky_max": 7.1,
                "rain_sum": 12,
                "showers_sum": 0,
                "snowfall_sum": 0,
                "precipitation_sum": 12,
                "precipitation_hours": 4,
                "wind_gusts_10m_max": 30.2,
                "wind_direction_10m_dominant": 347,
                "shortwave_radiation_sum": 10.29,
                "et0_fao_evapotranspiration": 1.67
            },
            {
                "date": "2026-05-22",
                "weather_code": 3,
                "temperature_2m_max": 20.4,
                "temperature_2m_min": 12.6,
                "apparent_temperature_max": 18.1,
                "apparent_temperature_min": 10.5,
                "daylight_duration": 52589.77,
                "sunset": "2026-05-22T20:16",
                "sunrise": "2026-05-22T05:39",
                "wind_speed_10m_max": 18.4,
                "precipitation_probability_max": 11,
                "sunshine_duration": 14532.13,
                "uv_index_max": 5.85,
                "uv_index_clear_sky_max": 7.35,
                "rain_sum": 0,
                "showers_sum": 0,
                "snowfall_sum": 0,
                "precipitation_sum": 0,
                "precipitation_hours": 0,
                "wind_gusts_10m_max": 42.8,
                "wind_direction_10m_dominant": 66,
                "shortwave_radiation_sum": 19.82,
                "et0_fao_evapotranspiration": 3.78
            },
            {
                "date": "2026-05-23",
                "weather_code": 63,
                "temperature_2m_max": 12.1,
                "temperature_2m_min": 9.1,
                "apparent_temperature_max": 10.7,
                "apparent_temperature_min": 5.7,
                "daylight_duration": 52682.62,
                "sunset": "2026-05-23T20:17",
                "sunrise": "2026-05-23T05:39",
                "wind_speed_10m_max": 21.7,
                "precipitation_probability_max": 98,
                "sunshine_duration": 0,
                "uv_index_max": 0.55,
                "uv_index_clear_sky_max": 6.7,
                "rain_sum": 28.52,
                "showers_sum": 0,
                "snowfall_sum": 0,
                "precipitation_sum": 28.52,
                "precipitation_hours": 20,
                "wind_gusts_10m_max": 49.7,
                "wind_direction_10m_dominant": 78,
                "shortwave_radiation_sum": 3.85,
                "et0_fao_evapotranspiration": 0.77
            },
            {
                "date": "2026-05-24",
                "weather_code": 63,
                "temperature_2m_max": 14.2,
                "temperature_2m_min": 11.4,
                "apparent_temperature_max": 13.8,
                "apparent_temperature_min": 9.2,
                "daylight_duration": 52773.32,
                "sunset": "2026-05-24T20:18",
                "sunrise": "2026-05-24T05:38",
                "wind_speed_10m_max": 18.9,
                "precipitation_probability_max": 98,
                "sunshine_duration": 323.34,
                "uv_index_max": 1.55,
                "uv_index_clear_sky_max": 6.8,
                "rain_sum": 12.6,
                "showers_sum": 0,
                "snowfall_sum": 0,
                "precipitation_sum": 12.6,
                "precipitation_hours": 12,
                "wind_gusts_10m_max": 46.1,
                "wind_direction_10m_dominant": 66,
                "shortwave_radiation_sum": 2.55,
                "et0_fao_evapotranspiration": 0.53
            },
            {
                "date": "2026-05-25",
                "weather_code": 81,
                "temperature_2m_max": 18.6,
                "temperature_2m_min": 13.1,
                "apparent_temperature_max": 20.6,
                "apparent_temperature_min": 13.4,
                "daylight_duration": 52861.76,
                "sunset": "2026-05-25T20:18",
                "sunrise": "2026-05-25T05:37",
                "wind_speed_10m_max": 5.8,
                "precipitation_probability_max": 33,
                "sunshine_duration": 14400,
                "uv_index_max": 2.75,
                "uv_index_clear_sky_max": 7.05,
                "rain_sum": 7.8,
                "showers_sum": 2,
                "snowfall_sum": 0,
                "precipitation_sum": 9.8,
                "precipitation_hours": 12,
                "wind_gusts_10m_max": 15.1,
                "wind_direction_10m_dominant": 11,
                "shortwave_radiation_sum": 4.68,
                "et0_fao_evapotranspiration": 0.9
            }
        ]
    }
}
*/