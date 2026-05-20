const {
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
    throw new Error(
      "Provide at least one valid location field."
    );
  }

  /* Get coordinates */
  const location = await getCoordinates(addressData);

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

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