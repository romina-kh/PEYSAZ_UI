const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/discounts/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const [discountResult] = await db.query(
            `WITH RECURSIVE Referrals AS (
                SELECT Referee FROM REFERS WHERE Referrer = ?
                UNION ALL
                SELECT r.Referee FROM REFERS r
                JOIN Referrals rs ON r.Referrer = rs.Referee
            )
            SELECT COUNT(*) AS discountCount FROM Referrals;`,
            [userId]
        );

        const [introduceResult] = await db.query(
            `SELECT CASE 
                WHEN EXISTS (SELECT 1 FROM REFERS WHERE Referee = ?) THEN 1
                ELSE 0 
            END AS being_interduce;`,
            [userId]
        );

        const finalDiscountCount = discountResult[0].discountCount + introduceResult[0].being_interduce;

        res.json({ userId, discountCount: finalDiscountCount });
    } catch (error) {
        console.error("Error fetching discount codes:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//========================================================================================================

router.get("/:referralCode", async (req, res) => {
    const { referralCode } = req.params;

    try {
        const [referrerResult] = await db.query(
            "SELECT ID FROM COSTUMER WHERE Referral_code = ?",
            [referralCode]
        );

        if (referrerResult.length === 0) {
            return res.status(404).json({ message: "Referral code not found" });
        }

        const referrerId = referrerResult[0].ID;

        const [countResult] = await db.query(
            "SELECT COUNT(*) AS inviteCount FROM REFERS WHERE Referrer = ?",
            [referrerId]
        );

        res.json({ referralCode, inviteCount: countResult[0].inviteCount });
    } catch (error) {
        console.error("Error fetching referral count:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
