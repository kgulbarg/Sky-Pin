const express = require("express");

const router = express.Router();

const {
  getCoordinates,
  validateLocationInput
} = require("../services/geocoordService");

/* POST /api/geocode */
router.post("/", async (req, res) => {

  console.log("BODY RECEIVED:", req.body);

  /* No JSON body sent */
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Request body is required"
    });
  }

  try {

    /* Validate input */
    const isValid = validateLocationInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        error: "At least one location field is required."
      });
    }

    /* Call geocoding service */
    const result = await getCoordinates(req.body);

    res.json(result);

  } catch (err) {

    console.error(err.message);

    res.status(500).json({
      error: err.message || "Location not found"
    });

  }

});

module.exports = router;