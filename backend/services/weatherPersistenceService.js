const pool = require("../db/connection");
const {
  createWeatherSearch,
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

module.exports = {
  buildCurrentWeatherDailyRow,
  getTodayDateString,
  recordWeatherSearchWithDailyRows,
};