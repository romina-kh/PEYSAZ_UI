const express = require("express");
const router = express.Router();
const db = require("../config/db");


router.get("/cart-states/:customerId", async (req, res) => {
    const { customerId } = req.params;

    try {
        const [result] = await db.query(
            `SELECT CNumber, Cstatus 
             FROM SHOPPING_CART 
             WHERE CID = ? 
             ORDER BY CNumber ASC`,
            [customerId]
        );

        if (result.length === 0) {
            return res.json({ message: "No carts found", carts: [] });
        }

        res.json({ carts: result });
    } catch (error) {
        console.error("Error fetching cart states:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;