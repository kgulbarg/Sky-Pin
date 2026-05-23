const {
  validateLocationInput,
  getCoordinates,
  LOCATION_INPUT_ERROR_MESSAGE
} = require("./geocoordService");

const {
  validateCoordinates,
  getWeatherData
} = require("./weatherService");

async function getForecast(addressData = {}) {

  const latitude = Number(addressData.latitude);
  const longitude = Number(addressData.longitude);

  const hasCoordinates =
    addressData.latitude !== undefined &&
    addressData.longitude !== undefined &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  if (hasCoordinates) {

    const coordinateError = validateCoordinates(latitude, longitude);

    if (coordinateError) {
      throw new Error(coordinateError);
    }

    const weather = await getWeatherData(latitude, longitude);

    return {
      location: {
        display_name: "Your current location",
        latitude,
        longitude
      },

      weather
    };
  }

  /* Validate address input */
  const isValid = validateLocationInput(addressData);

  if (!isValid) {
    throw new Error(LOCATION_INPUT_ERROR_MESSAGE);
  }

  /* Get coordinates */
  const location = await getCoordinates(addressData);

  const locationLatitude = Number(location.latitude);
  const locationLongitude = Number(location.longitude);

  if (!Number.isFinite(locationLatitude) || !Number.isFinite(locationLongitude)) {
    throw new Error("Latitude and longitude must be finite numbers.");
  }

  /* Validate coordinates returned */
  const coordinateError = validateCoordinates(
    locationLatitude,
    locationLongitude
  );

  if (coordinateError) {
    throw new Error(coordinateError);
  }

  /* Get weather */
  const weather = await getWeatherData(
    locationLatitude,
    locationLongitude
  );

  return {
    location: {
      display_name: location.display_name,
      latitude: locationLatitude,
      longitude: locationLongitude
    },

    weather
  };
}

module.exports = {
  getForecast
};
