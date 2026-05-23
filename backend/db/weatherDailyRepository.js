const pool = require("./connection");

async function createWeatherDailyRows(searchId, dailyRows = [], db = pool) {
  if (!searchId || !Array.isArray(dailyRows) || dailyRows.length === 0) {
    return;
  }

  const values = [];
  const placeholders = dailyRows
    .map((row, index) => {
      const baseIndex = index * 7;

      values.push(
        searchId,
        row.date ?? null,
        row.temp ?? null,
        row.temp_2m ?? null,
        row.rain ?? null,
        row.wind ?? null,
        row.weatherCode ?? row["weather code"] ?? null
      );

      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7})`;
    })
    .join(", ");

  await db.query(
    `
      INSERT INTO weather_daily (
        search_id,
        date,
        temp,
        temp_2m,
        rain,
        wind,
        "weather code"
      )
      VALUES ${placeholders}
    `,
    values
  );
}

module.exports = {
  createWeatherDailyRows,
};