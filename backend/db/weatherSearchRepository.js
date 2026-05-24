const pool = require("./connection");

async function createWeatherSearch(searchData = {}, db = pool) {
  const {
    searchTime = new Date(),
    city = null,
    state = null,
    cunty = null,
    country = null,
    pincode = null,
    latitude = null,
    longitude = null,
    startDate = null,
    endDate = null,
    userNotes = null,
  } = searchData;

  const result = await db.query(
    `
      INSERT INTO weather_searches (
        search_time,
        city,
        state,
        cunty,
        country,
        pincode,
        latitude,
        longitude,
        start_date,
        end_date,
        user_notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `,
    [
      searchTime,
      city,
      state,
      cunty,
      country,
      pincode,
      latitude,
      longitude,
      startDate,
      endDate,
      userNotes,
    ]
  );

  return result.rows[0].id;
}

async function listWeatherSearches(db = pool) {
  const result = await db.query(
    `
      SELECT
        id,
        search_time,
        city,
        state,
        cunty,
        country,
        pincode,
        latitude,
        longitude,
        start_date,
        end_date,
        user_notes
      FROM weather_searches
      ORDER BY search_time DESC, id DESC
    `
  );

  return result.rows;
}

module.exports = {
  createWeatherSearch,
  listWeatherSearches,
};