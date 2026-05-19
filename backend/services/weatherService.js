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

module.exports = {
  validateCoordinates,
  getWeatherData,
};
