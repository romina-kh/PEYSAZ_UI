const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/expiring/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const [result] = await db.query(
            `SELECT p.DCODE , d.Expiration_date
            FROM PRIVATE_CODE p JOIN DISCOUNT_CODE d ON p.DCODE = d.DCODE
            WHERE p.DID = ? AND d.Expiration_date > NOW() AND d.Expiration_date <= NOW() + INTERVAL 7 DAY`,
            [userId]
        );

        res.json({ expiringDiscounts: result });
    } catch (error) {
        console.error("Error fetching expiring discount codes:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;