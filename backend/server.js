const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { initializeDatabaseSchema } = require("./db/initSchema");

const app = express();

app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/geocoord", require("./routes/geocoord")); // Only exposed for dev testing, not used by frontend
app.use("/api/weather", require("./routes/weather")); // Only exposed for dev testing, not used by frontend
app.use("/api/forecast", require("./routes/forecast"));
app.use("/api/forecastDays", require("./routes/forecastDays"));

/* Health check */
app.get("/", (req, res) => {
  res.json({
    message: "SkyPin backend is running"
  });
});

const BACKEND_PORT = parseInt(process.env.BACKEND_PORT, 10) || 3000;

async function startServer() {
  await initializeDatabaseSchema();

  app.listen(BACKEND_PORT, () => {
    console.log(`Server running on BACKEND_PORT ${BACKEND_PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to initialize database schema:", error);
  process.exit(1);
});
