const express = require("express");
const router = express.Router();
const db = require("../config/db");


router.get("/last-5-shopping/:customerId", async (req, res) => {
    const { customerId } = req.params;

    try {
        const [result] = await db.query(
            `SELECT i.ITracking_code AS TrackingCode, 
                    t.transaction_status AS Status, 
                    i.ICart_number AS CartNumber, 
                    i.ILocked_Number AS LockedNumber, 
                    t.TTimestamp AS Timestamp
             FROM ISSUED_FOR i
             JOIN TRANSACTIONS t ON i.ITracking_code = t.Tracking_code
             WHERE i.IID = ?
             ORDER BY t.TTimestamp DESC
             LIMIT 5`,
            [customerId]
        );

        res.json({ last5Shopping: result });
    } catch (error) {
        console.error("Error fetching last 5 shopping transactions:", error);
        res.status(500).json({ message: "Server error" });
    }
});


//=====================================================================


router.get("/monthly/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const [transactions] = await db.query(
            `SELECT L.Cart_number, L.CNumber, T.Tracking_code, T.transaction_status, T.TTimestamp
             FROM VIP_CLIENTS V JOIN LOCKED_SHOPPING_CART L ON V.VID = L.LCID
             JOIN ISSUED_FOR I ON L.LCID = I.IID AND L.Cart_number = I.ICart_number AND L.CNumber = I.ILocked_Number
             JOIN TRANSACTIONS T ON I.ITracking_code = T.Tracking_code
             WHERE L.LCID = ?
             AND T.transaction_status = 'successful'
             AND T.TTimestamp >= DATE_SUB(NOW(), INTERVAL 1 MONTH) AND V.Subscription_expiration_time > CURRENT_TIMESTAMP
             ORDER BY T.TTimestamp DESC`,
            [userId]
        );

        if (transactions.length === 0) {
            return res.json({ shoppingHistory:[], cashbackAmount:0 });
        }

        let totalSpent = 0;
        const cartPromises = transactions.map(async (cart) => {
            
            await db.query("CALL cart_price(?, ?, ?, @final_price);", [
                userId,
                cart.Cart_number,
                cart.CNumber,
            ]);

            
            const [result] = await db.query("SELECT @final_price AS final_price;");
            cart.final_price = result[0].final_price; 

            totalSpent += parseFloat(cart.final_price);
            return cart;
        });

        const shoppingHistory = await Promise.all(cartPromises);
        const cashbackAmount = totalSpent * 0.15; 
        Math.abs(cashbackAmount);

        res.json({ shoppingHistory, cashbackAmount });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;