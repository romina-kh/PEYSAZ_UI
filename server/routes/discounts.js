const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/expiring/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const [result] = await db.query(
            `SELECT p.DCODE , p.DTimestamp
            FROM PRIVATE_CODE p
            WHERE p.DID = ? AND p.DTimestamp <= NOW() + INTERVAL 7 DAY`,
            [userId]
        );

        res.json({ expiringDiscounts: result });
    } catch (error) {
        console.error("Error fetching expiring discount codes:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;