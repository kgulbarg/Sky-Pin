const express = require("express");

const router = express.Router();

const {
  getForecast
} = require("../services/forecastService");

router.post("/", async (req, res) => {

  try {

    /* Empty body */
    if (
      !req.body ||
      Object.keys(req.body).length === 0
    ) {
      return res.status(400).json({
        error: "Request body is required."
      });
    }

    const result = await getForecast(req.body);

    res.json(result);

  } catch (err) {

    console.error(err.message);

    res.status(500).json({
      error: err.message || "Forecast failed."
    });

  }

});

module.exports = router;