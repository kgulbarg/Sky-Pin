const axios = require("axios");

const LOCATION_INPUT_ERROR_MESSAGE =
  "Country is required with postal code or city and state or county.";

/*
Validate location input.
All provided values must be strings.
Accepted combinations are country + postalcode or country + city + (state or county).
*/
function validateLocationInput(data = {}) {

  const {
    city,
    county,
    state,
    country,
    postalcode
  } = data;

  const fields = [city, county, state, country, postalcode];

  /* Reject non-string values for any provided field */
  if (fields.some(field => field !== undefined && typeof field !== "string")) {
    return false;
  }

  const hasCity = typeof city === "string" && city.trim().length > 0;
  const hasCounty = typeof county === "string" && county.trim().length > 0;
  const hasState = typeof state === "string" && state.trim().length > 0;
  const hasCountry = typeof country === "string" && country.trim().length > 0;
  const hasPostalcode =
    typeof postalcode === "string" && postalcode.trim().length > 0;

  return hasCountry && (hasPostalcode || (hasCity && (hasState || hasCounty)));
}

async function getCoordinates(addressData = {}) {

  const response = await axios.get(
    "https://geocode.maps.co/search",
    {
      timeout: 5000,
      params: {
        api_key: process.env.GEOCODE_API_KEY,

        city: addressData.city || "",
        county: addressData.county || "",
        state: addressData.state || "",
        country: addressData.country || "",
        postalcode: addressData.postalcode || ""
      }
    }
  );

  /* No results */
  if (!response.data || response.data.length === 0) {
    throw new Error("Location not found.");
  }

  /* Take best match */
  const location = response.data[0];

  return {
    latitude: location.lat,
    longitude: location.lon,
    display_name: location.display_name
  };
}

module.exports = {
  LOCATION_INPUT_ERROR_MESSAGE,
  getCoordinates,
  validateLocationInput
};