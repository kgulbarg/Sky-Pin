const {
  LOCATION_INPUT_ERROR_MESSAGE,
  validateLocationInput,
  getCoordinates
} = require("./geocoordService");

const {
  validateCoordinates,
  getWeatherData
} = require("./weatherService");

async function getForecast(addressData = {}) {

  /* Validate address input */
  const isValid = validateLocationInput(addressData);

  if (!isValid) {
    throw new Error(LOCATION_INPUT_ERROR_MESSAGE);
  }

  /* Get coordinates */
  const location = await getCoordinates(addressData);

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Latitude and longitude must be finite numbers.");
  }

  /* Validate coordinates returned */
  const coordinateError = validateCoordinates(
    latitude,
    longitude
  );

  if (coordinateError) {
    throw new Error(coordinateError);
  }

  /* Get weather */
  const weather = await getWeatherData(
    latitude,
    longitude
  );

  return {
    location: {
      display_name: location.display_name,
      latitude,
      longitude
    },

    weather
  };
}

module.exports = {
  getForecast
};
