const {
  validateLocationInput,
  getCoordinates
} = require("./geocoordService");

const {
  validateCoordinates,
  getFiveDayWeatherData
} = require("./weatherService");

async function getForecast5Day(addressData = {}) {
  const isValid = validateLocationInput(addressData);

  if (!isValid) {
    throw new Error("Provide at least one valid location field.");
  }

  const location = await getCoordinates(addressData);

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Latitude and longitude must be finite numbers.");
  }

  const coordinateError = validateCoordinates(latitude, longitude);

  if (coordinateError) {
    throw new Error(coordinateError);
  }

  const forecast = await getFiveDayWeatherData(latitude, longitude);

  return {
    location: {
      display_name: location.display_name,
      latitude,
      longitude
    },
    forecast
  };
}

module.exports = {
  getForecast5Day
};