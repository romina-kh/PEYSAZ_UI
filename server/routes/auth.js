const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/login", async (req, res) => {
    const { Phone_number } = req.body;

    if (!Phone_number) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    try {
        const [results] = await db.query(
            "SELECT * FROM COSTUMER WHERE Phone_number = ?", 
            [Phone_number]
        );

        if (results.length === 0) {
            return res.status(401).json({ message: "Customer NOT found!" });
        }

        const costumer = results[0];

        res.json({ costumer });
    } catch (error) {
        res.status(500).json({ message: "Database error", error: error.message });
    }
});

module.exports = router;