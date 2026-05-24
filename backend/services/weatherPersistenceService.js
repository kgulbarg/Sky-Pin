const pool = require("../db/connection");
const {
  createWeatherSearch,
  deleteWeatherSearch,
  listWeatherSearches,
  updateWeatherSearchNotes,
} = require("../db/weatherSearchRepository");
const {
  createWeatherDailyRows,
} = require("../db/weatherDailyRepository");

const WEATHER_DATA_CSV_HEADERS = [
  "search_id",
  "search_time",
  "updated_at",
  "city",
  "state",
  "cunty",
  "country",
  "pincode",
  "latitude",
  "longitude",
  "start_date",
  "end_date",
  "user_notes",
  "daily_id",
  "daily_date",
  "temp",
  "temp_2m",
  "rain",
  "wind",
  "weather_code",
];

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = value instanceof Date ? value.toISOString() : String(value);

  if (/[,\n\r"]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function buildWeatherDataCsv(rows = []) {
  const csvRows = [WEATHER_DATA_CSV_HEADERS.join(",")];

  for (const row of rows) {
    csvRows.push(
      WEATHER_DATA_CSV_HEADERS.map((header) => escapeCsvValue(row?.[header])).join(","),
    );
  }

  return `${csvRows.join("\n")}\n`;
}

function getTodayDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(date);
}

function buildCurrentWeatherDailyRow(weatherData = {}, date = getTodayDateString()) {
  const current = weatherData.current || {};

  return {
    date,
    temp: current.temperature_2m ?? null,
    temp_2m: current.apparent_temperature ?? null,
    rain: current.rain ?? null,
    wind: current.wind_speed_10m ?? null,
    weatherCode: current.weather_code ?? null,
  };
}

function buildFiveDayWeatherDailyRows(forecastData = {}) {
  const daily = Array.isArray(forecastData.daily) ? forecastData.daily : [];


  return daily.map((day) => ({
    date: day.date ?? null,
    temp: day.temperature_2m_max ?? null,
    temp_2m: day.temperature_2m_min ?? null,
    rain: day.rain_sum ?? null,
    wind: day.wind_speed_10m_max ?? null,
    weatherCode: day.weather_code ?? null,
  }));
}

async function recordWeatherSearchWithDailyRows(searchData = {}, dailyRows = []) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const searchId = await createWeatherSearch(searchData, client);

    if (Array.isArray(dailyRows) && dailyRows.length > 0) {
      await createWeatherDailyRows(searchId, dailyRows, client);
    }

    await client.query("COMMIT");

    return searchId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getPastWeatherSearches() {
  return listWeatherSearches();
}

async function getWeatherDataCsv() {
  const result = await pool.query(
    `
      SELECT
        s.id AS search_id,
        s.search_time,
        s.updated_at,
        s.city,
        s.state,
        s.cunty,
        s.country,
        s.pincode,
        s.latitude,
        s.longitude,
        s.start_date,
        s.end_date,
        s.user_notes,
        d.id AS daily_id,
        d.date AS daily_date,
        d.temp,
        d.temp_2m,
        d.rain,
        d.wind,
        d."weather code" AS weather_code
      FROM weather_searches s
      LEFT JOIN weather_daily d ON d.search_id = s.id
      ORDER BY s.search_time DESC, s.id DESC, d.date ASC, d.id ASC
    `,
  );

  return buildWeatherDataCsv(result.rows);
}

async function saveWeatherSearchNotes(searchId, userNotes) {
  return updateWeatherSearchNotes(searchId, userNotes);
}

async function removeWeatherSearch(searchId) {
  return deleteWeatherSearch(searchId);
}

module.exports = {
  buildCurrentWeatherDailyRow,
  buildFiveDayWeatherDailyRows,
  buildWeatherDataCsv,
  getTodayDateString,
  getPastWeatherSearches,
  getWeatherDataCsv,
  recordWeatherSearchWithDailyRows,
  removeWeatherSearch,
  saveWeatherSearchNotes,
};