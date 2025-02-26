require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const app = express();


app.use(cors());
app.use(express.json()); 


app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const costumerRoutes = require("./routes/costumers");
const authRoutes = require("./routes/auth");
const addressRoutes = require("./routes/address");
const referralRoutes = require("./routes/referral");
const discountsRoutes = require("./routes/discounts");
const cartRoutes = require("./routes/cart");


app.use("/costumers", costumerRoutes);
app.use("/auth" , authRoutes);
app.use("/addresses", addressRoutes);
app.use("/referrals",referralRoutes);
app.use("/discounts",discountsRoutes);
app.use("/cart", cartRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

