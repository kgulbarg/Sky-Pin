require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/geocoord", require("./routes/geocoord"));

/* Health check */
app.get("/", (req, res) => {
  res.json({
    message: "SkyPin backend is running"
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});