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
    user_notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

// const ADD_WEATHER_SEARCHES_UPDATED_AT_COLUMN = `
//   ALTER TABLE weather_searches
//   ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// `;

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
  // await pool.query(ADD_WEATHER_SEARCHES_UPDATED_AT_COLUMN);
  await pool.query(CREATE_WEATHER_DAILY_TABLE);
}

module.exports = {
  initializeDatabaseSchema,
  CREATE_WEATHER_SEARCHES_TABLE,
  // ADD_WEATHER_SEARCHES_UPDATED_AT_COLUMN,
  CREATE_WEATHER_DAILY_TABLE,
};