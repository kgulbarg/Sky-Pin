const express = require("express");

const router = express.Router();

const {
  getForecast5Day
} = require("../services/forecast5dayService");

router.post("/", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is required."
      });
    }

    const result = await getForecast5Day(req.body);

    res.json(result);
  } catch (err) {
    console.error(err.message);

    if (err.message === "Provide at least one valid location field.") {
      return res.status(400).json({
        error: err.message
      });
    }

    if (err.message === "Location not found.") {
      return res.status(404).json({
        error: err.message
      });
    }

    res.status(500).json({
      error: err.message || "5-day forecast failed."
    });
  }
});

module.exports = router;