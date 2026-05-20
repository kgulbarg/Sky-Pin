const express = require("express");

const router = express.Router();



const {
  getCoordinates,
  validateLocationInput
} = require("../services/geocoordService");

/* POST /api/geocode */
router.post("/", async (req, res) => {

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

    if (err.message === "Exact location not found.") {
      return res.status(404).json({
        error: "Exact location not found."
      });
    }

    res.status(500).json({
      error: "An unexpected error occurred"
    });

  }

});

module.exports = router;
