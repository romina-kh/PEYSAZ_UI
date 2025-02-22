require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const app = express();


app.use(cors());
app.use(express.json()); // Allows JSON data in requests


app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const costumerRoutes = require("./routes/costumers");
app.use("/costumers", costumerRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

