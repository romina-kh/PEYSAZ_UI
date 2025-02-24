const express = require("express");
const router = express.Router();
const db = require("../config/db"); 


router.post("/login", (req, res) => 
{
  const { Phone_number } = req.body;

  if (!Phone_number) {
    return res.status(400).json({ message: "Phone number is required" });
  }


  db.query("SELECT * FROM COSTUMER WHERE Phone_number = ?", [Phone_number], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: "Costumer not found" });
    }

    const costumer = results[0];

    res.json({
      message: "Login successful",
      costumer: {
        ID: costumer.ID,
        Phone_number: costumer.Phone_number,
        First_name: costumer.First_name,
        Last_name: costumer.Last_name,
        Wallet_balance: costumer.Wallet_balance,
        Referral_code: costumer.Referral_code
      }
    });
  });
});

module.exports = router;


	
