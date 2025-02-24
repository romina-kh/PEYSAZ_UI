const express = require("express");
const router = express.Router();
const db = require("../config/db"); 


router.post("/:ID", async (req, res) => {
    const userId = req.params.ID 
    const { Province, Remainder } = req.body;

    if (!Province) return res.status(400).json({ message: "Province is required." });

    try {
        const sql = "INSERT INTO ADDRESS (AID, Province, Remainder) VALUES (?, ?, ?)";
        await db.query(sql, [userId, Province, Remainder]); // Fix: Added await

        res.status(201).json({ message: "Address added successfully!" });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:ID", async (req, res) => {
    const userId = req.params.ID

    try {
        const sql = "SELECT Province, Remainder FROM ADDRESS WHERE AID = ?";
        const [addresses] = await db.query(sql, [userId]); 

        res.status(200).json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:ID/:province", async (req, res) => {
    const { ID, province } = req.params

    try {
        const sql = "DELETE FROM ADDRESS WHERE AID = ? AND Province = ?";
        await db.query(sql, [ID, province]);

        res.json({ message: "Address deleted successfully!" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router;