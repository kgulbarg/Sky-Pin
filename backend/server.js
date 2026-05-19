require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/geocode", require("./routes/geocode"));

/* Health check */
app.get("/", (req, res) => {
  res.json({
    message: "SkyPin backend is running"
  });
});

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});