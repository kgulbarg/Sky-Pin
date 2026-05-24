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

async function saveWeatherSearchNotes(searchId, userNotes) {
  return updateWeatherSearchNotes(searchId, userNotes);
}

async function removeWeatherSearch(searchId) {
  return deleteWeatherSearch(searchId);
}

module.exports = {
  buildCurrentWeatherDailyRow,
  buildFiveDayWeatherDailyRows,
  getTodayDateString,
  getPastWeatherSearches,
  recordWeatherSearchWithDailyRows,
  removeWeatherSearch,
  saveWeatherSearchNotes,
};