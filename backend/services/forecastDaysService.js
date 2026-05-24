const {
  validateLocationInput,
  getCoordinates,
  LOCATION_INPUT_ERROR_MESSAGE
} = require("./geocoordService");

const {
  validateCoordinates,
  getFiveDayWeatherData,
  getWeatherDataForDateRange,
  validateDateRange
} = require("./weatherService");
const {
  getTodayDateString
} = require("./weatherPersistenceService");

function getDefaultFiveDayDateRange() {
  const startDate = getTodayDateString();
  const endDate = getTodayDateString(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000));

  return {
    startDate,
    endDate
  };
}

async function getForecastDays(addressData = {}) {

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

    const hasCustomDateRange = addressData.startDate || addressData.endDate;

    if (hasCustomDateRange) {
      const dateRangeError = validateDateRange(addressData.startDate, addressData.endDate);

      if (dateRangeError) {
        throw new Error(dateRangeError);
      }

      const forecast = await getWeatherDataForDateRange(
        latitude,
        longitude,
        addressData.startDate,
        addressData.endDate
      );

      return {
        location: {
          display_name: "Your current location",
          latitude,
          longitude
        },
        forecast,
        dateRange: {
          startDate: addressData.startDate,
          endDate: addressData.endDate
        }
      };
    }

    const forecast = await getFiveDayWeatherData(latitude, longitude);

    return {
      location: {
        display_name: "Your current location",
        latitude,
        longitude
      },
      forecast,
      dateRange: getDefaultFiveDayDateRange()
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

  const hasCustomDateRange = addressData.startDate || addressData.endDate;

  if (hasCustomDateRange) {
    const dateRangeError = validateDateRange(addressData.startDate, addressData.endDate);

    if (dateRangeError) {
      throw new Error(dateRangeError);
    }
  }

  const forecast = hasCustomDateRange
    ? await getWeatherDataForDateRange(
      locationLatitude,
      locationLongitude,
      addressData.startDate,
      addressData.endDate
    )
    : await getFiveDayWeatherData(locationLatitude, locationLongitude);

  return {
    location: {
      display_name: location.display_name,
      latitude: locationLatitude,
      longitude: locationLongitude
    },
    forecast,
    dateRange: hasCustomDateRange
      ? {
        startDate: addressData.startDate,
        endDate: addressData.endDate,
      }
      : getDefaultFiveDayDateRange()
  };
}

module.exports = {
  getForecastDays
};