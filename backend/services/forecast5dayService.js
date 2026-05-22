const {
  validateLocationInput,
  getCoordinates,
  LOCATION_INPUT_ERROR_MESSAGE
} = require("./geocoordService");

const {
  validateCoordinates,
  getFiveDayWeatherData
} = require("./weatherService");

async function getForecast5Day(addressData = {}) {

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

    const forecast = await getFiveDayWeatherData(latitude, longitude);

    return {
      location: {
        display_name: "Your current location",
        latitude,
        longitude
      },
      forecast
    };
  }

  const isValid = validateLocationInput(addressData);

  if (!isValid) {
    throw new Error(LOCATION_INPUT_ERROR_MESSAGE);
  }

  const location = await getCoordinates(addressData);

  const locationLatitude = Number(location.latitude);
  const locationLongitude = Number(location.longitude);

  if (!Number.isFinite(locationLatitude) || !Number.isFinite(locationLongitude)) {
    throw new Error("Latitude and longitude must be finite numbers.");
  }

  const resolvedCoordinateError = validateCoordinates(
    locationLatitude,
    locationLongitude
  );

  if (resolvedCoordinateError) {
    throw new Error(resolvedCoordinateError);
  }

  const forecast = await getFiveDayWeatherData(locationLatitude, locationLongitude);

  return {
    location: {
      display_name: location.display_name,
      latitude: locationLatitude,
      longitude: locationLongitude
    },
    forecast
  };
}

module.exports = {
  getForecast5Day
};