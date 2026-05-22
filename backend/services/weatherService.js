const axios = require("axios");

/* Validate latitude and longitude */
function validateCoordinates(latitude, longitude) {
  if (latitude === undefined || longitude === undefined) {
    return "Latitude and longitude are required.";
  }

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return "Latitude and longitude must be numbers.";
  }

  if (latitude < -90 || latitude > 90) {
    return "Latitude must be between -90 and 90.";
  }

  if (longitude < -180 || longitude > 180) {
    return "Longitude must be between -180 and 180.";
  }

  return null;
}

/* Fetch weather data */
async function getWeatherData(latitude, longitude) {
  const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
    params: {
      latitude,
      longitude,

      current: [
        "precipitation",
        "rain",
        "temperature_2m",
        "relative_humidity_2m",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
        "cloud_cover",
        "pressure_msl",
        "surface_pressure",
        "showers",
        "snowfall",
        "is_day",
        "apparent_temperature",
      ].join(","),
      timezone: "auto",
    },
  });

  const data = response.data;

  if (!data.current) {
    throw new Error("Weather data not found.");
  }

  return {
    coordinates: {
      latitude: data.latitude,
      longitude: data.longitude,
    },

    generationtime_ms: data.generationtime_ms,

    elevation: data.elevation,

    timezone: {
      name: data.timezone,
      abbreviation: data.timezone_abbreviation,
      utc_offset_seconds: data.utc_offset_seconds,
    },

    current_units: data.current_units,

    current: {
      time: data.current.time,
      interval: data.current.interval,

      temperature_2m: data.current.temperature_2m,
      apparent_temperature: data.current.apparent_temperature,

      precipitation: data.current.precipitation,
      rain: data.current.rain,
      showers: data.current.showers,
      snowfall: data.current.snowfall,

      relative_humidity_2m: data.current.relative_humidity_2m,
      weather_code: data.current.weather_code,
      cloud_cover: data.current.cloud_cover,

      surface_pressure: data.current.surface_pressure,
      pressure_msl: data.current.pressure_msl,

      wind_speed_10m: data.current.wind_speed_10m,
      wind_direction_10m: data.current.wind_direction_10m,
      wind_gusts_10m: data.current.wind_gusts_10m,

      is_day: data.current.is_day,
    },
  };
}

const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "daylight_duration",
  "sunset",
  "sunrise",
  "wind_speed_10m_max",
  "precipitation_probability_max",
  "sunshine_duration",
  "uv_index_max",
  "uv_index_clear_sky_max",
  "rain_sum",
  "showers_sum",
  "snowfall_sum",
  "precipitation_sum",
  "precipitation_hours",
  "wind_gusts_10m_max",
  "wind_direction_10m_dominant",
  "shortwave_radiation_sum",
  "et0_fao_evapotranspiration"
];

function buildDailyForecast(data) {
  const daily = data.daily || {};
  const count = Array.isArray(daily.time) ? daily.time.length : 0;

  return Array.from({ length: count }, (_, index) => ({
    date: daily.time?.[index],
    weather_code: daily.weather_code?.[index],
    temperature_2m_max: daily.temperature_2m_max?.[index],
    temperature_2m_min: daily.temperature_2m_min?.[index],
    apparent_temperature_max: daily.apparent_temperature_max?.[index],
    apparent_temperature_min: daily.apparent_temperature_min?.[index],
    daylight_duration: daily.daylight_duration?.[index],
    sunset: daily.sunset?.[index],
    sunrise: daily.sunrise?.[index],
    wind_speed_10m_max: daily.wind_speed_10m_max?.[index],
    precipitation_probability_max: daily.precipitation_probability_max?.[index],
    sunshine_duration: daily.sunshine_duration?.[index],
    uv_index_max: daily.uv_index_max?.[index],
    uv_index_clear_sky_max: daily.uv_index_clear_sky_max?.[index],
    rain_sum: daily.rain_sum?.[index],
    showers_sum: daily.showers_sum?.[index],
    snowfall_sum: daily.snowfall_sum?.[index],
    precipitation_sum: daily.precipitation_sum?.[index],
    precipitation_hours: daily.precipitation_hours?.[index],
    wind_gusts_10m_max: daily.wind_gusts_10m_max?.[index],
    wind_direction_10m_dominant: daily.wind_direction_10m_dominant?.[index],
    shortwave_radiation_sum: daily.shortwave_radiation_sum?.[index],
    et0_fao_evapotranspiration: daily.et0_fao_evapotranspiration?.[index]
  }));
}

async function getFiveDayWeatherData(latitude, longitude) {
  const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
    params: {
      latitude,
      longitude,
      daily: DAILY_FIELDS.join(","),
      forecast_days: 5,
      timezone: "auto"
    }
  });

  const data = response.data;

  if (!data.daily || !Array.isArray(data.daily.time) || data.daily.time.length === 0) {
    throw new Error("5-day forecast data not found.");
  }

  return {
    coordinates: {
      latitude: data.latitude,
      longitude: data.longitude
    },
    generationtime_ms: data.generationtime_ms,
    elevation: data.elevation,
    timezone: {
      name: data.timezone,
      abbreviation: data.timezone_abbreviation,
      utc_offset_seconds: data.utc_offset_seconds
    },
    daily_units: data.daily_units,
    daily: buildDailyForecast(data)
  };
}

module.exports = {
  validateCoordinates,
  getWeatherData,
  getFiveDayWeatherData,
};
