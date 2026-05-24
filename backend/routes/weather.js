const express = require("express");

const router = express.Router();

const {
  validateCoordinates,
  getWeatherData,
} = require("../services/weatherService");
const {
  buildCurrentWeatherDailyRow,
  getPastWeatherSearches,
  getWeatherDataCsv,
  removeWeatherSearch,
  recordWeatherSearchWithDailyRows,
  saveWeatherSearchNotes,
  getTodayDateString,
} = require("../services/weatherPersistenceService");

/* GET /api/weather/export */
router.get("/export", async (req, res) => {
  try {
    const csv = await getWeatherDataCsv();

    res
      .status(200)
      .setHeader("Content-Type", "text/csv; charset=utf-8")
      .setHeader("Content-Disposition", 'attachment; filename="weather-data.csv"')
      .send(csv);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: err.message || "Failed to export weather data.",
    });
  }
});

/* GET /api/weather/searches */
router.get("/searches", async (req, res) => {
  try {
    const searches = await getPastWeatherSearches();

    res.json({ searches });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: err.message || "Failed to load past searches.",
    });
  }
});

/* PATCH /api/weather/searches/:searchId/notes */
router.patch("/searches/:searchId/notes", async (req, res) => {
  try {
    const searchId = Number.parseInt(req.params.searchId, 10);

    if (!Number.isInteger(searchId) || searchId <= 0) {
      return res.status(400).json({ error: "A valid search id is required." });
    }

    const { userNotes = null } = req.body || {};
    const updatedSearch = await saveWeatherSearchNotes(searchId, userNotes);

    if (!updatedSearch) {
      return res.status(404).json({ error: "Past search not found." });
    }

    res.json({ search: updatedSearch });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: err.message || "Failed to update notes.",
    });
  }
});

/* DELETE /api/weather/searches/:searchId */
router.delete("/searches/:searchId", async (req, res) => {
  try {
    const searchId = Number.parseInt(req.params.searchId, 10);

    if (!Number.isInteger(searchId) || searchId <= 0) {
      return res.status(400).json({ error: "A valid search id is required." });
    }

    const deletedSearch = await removeWeatherSearch(searchId);

    if (!deletedSearch) {
      return res.status(404).json({ error: "Past search not found." });
    }

    res.json({ deletedSearchId: searchId });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: err.message || "Failed to delete past search.",
    });
  }
});

/* POST /api/weather */
router.post("/", async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  try {
    /* Empty body */
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is required.",
      });
    }

    const { latitude, longitude } = req.body;

    /* Validate coordinates */
    const validationError = validateCoordinates(latitude, longitude);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    /* Fetch weather */
    const weatherData = await getWeatherData(latitude, longitude);

    await recordWeatherSearchWithDailyRows({
      latitude,
      longitude,
      startDate: getTodayDateString(),
      endDate: getTodayDateString(),
    }, [buildCurrentWeatherDailyRow(weatherData)]);

    res.json(weatherData);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: err.message || "Failed to fetch weather data.",
    });
  }
});

module.exports = router;
