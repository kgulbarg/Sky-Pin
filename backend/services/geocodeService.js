const axios = require("axios");

/*
Validate location input
All values must be strings
At least one field must exist
*/
function validateLocationInput(data = {}) {

  const {
    street,
    city,
    county,
    state,
    country,
    postalcode
  } = data;

  return [
    street,
    city,
    county,
    state,
    country,
    postalcode
  ].some(field =>
    typeof field === "string" && field.trim().length > 0
  );
}

async function geocodeLocation(addressData = {}) {

  const response = await axios.get(
    "https://geocode.maps.co/search",
    {
      params: {
        api_key: process.env.GEOCODE_API_KEY,

        street: addressData.street || "",
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
    throw new Error("Location not found");
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
  geocodeLocation,
  validateLocationInput
};