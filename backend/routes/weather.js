const express = require("express");

const router = express.Router();

const {
  validateCoordinates,
  getWeatherData,
} = require("../services/weatherService");

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

    res.json(weatherData);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: err.message || "Failed to fetch weather data.",
    });
  }
});

module.exports = router;
