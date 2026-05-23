const pool = require("./connection");

const CREATE_WEATHER_SEARCHES_TABLE = `
  CREATE TABLE IF NOT EXISTS weather_searches (
    id BIGSERIAL PRIMARY KEY,
    search_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    city TEXT,
    state TEXT,
    cunty TEXT,
    country TEXT,
    pincode TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    start_date DATE,
    end_date DATE,
    user_notes TEXT
  )
`;

const CREATE_WEATHER_DAILY_TABLE = `
  CREATE TABLE IF NOT EXISTS weather_daily (
    id BIGSERIAL PRIMARY KEY,
    search_id BIGINT NOT NULL REFERENCES weather_searches(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    temp NUMERIC,
    temp_2m NUMERIC,
    rain NUMERIC,
    wind NUMERIC,
    "weather code" INTEGER
  )
`;

async function initializeDatabaseSchema() {
  await pool.query(CREATE_WEATHER_SEARCHES_TABLE);
  await pool.query(CREATE_WEATHER_DAILY_TABLE);
}

module.exports = {
  initializeDatabaseSchema,
  CREATE_WEATHER_SEARCHES_TABLE,
  CREATE_WEATHER_DAILY_TABLE,
};