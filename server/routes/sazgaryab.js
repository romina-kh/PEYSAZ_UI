const express = require("express");
const router = express.Router();
const db = require("../config/db");

const isVIPUser = async (userId) => {
    const query = "SELECT 1 FROM VIP_CLIENTS WHERE VID = ?";
    try {
        const [results] = await db.query(query, [userId]);
        return results.length > 0;
    } catch (error) {
        throw error;
    }
};

const getProductId = async (productCategory, productName) => {
    if (!productCategory || !productName) {
        return null; 
    }

    const query = `
        SELECT ID FROM PRODUCT 
        WHERE Category = ? 
        AND CONCAT(Brand, ' ', Model) LIKE ? 
        LIMIT 1`;

    try {
        const [results] = await db.query(query, [productCategory, `%${productName}%`]);

        if (results.length === 0) {
            return null;
        }
        return results[0].ID;
    } catch (error) {
        throw error;
    }
};

const findCompatibleProducts = async (productId, isVIP) => {
    const query = `
        SELECT P.ID, P.Brand, P.Model, P.Category 
        FROM PRODUCT P
        WHERE P.ID IN (
            SELECT Power_ID FROM CONNECTOR_COMPATIBLE_WITH WHERE GPU_ID = ?
            UNION
            SELECT Motherboard_ID FROM SM_SLOT_COMPATIBLE_WITH WHERE SSD_ID = ?
            UNION
            SELECT Motherboard_ID FROM RM_SLOT_COMPATIBLE_WITH WHERE RAM_ID = ?
            UNION
            SELECT Cooler_ID FROM CC_SOCKET_COMPATIBLE_WITH WHERE CPU_ID = ?
            UNION
            SELECT Motherboard_ID FROM MC_SOCKET_COMPATIBLE_WITH WHERE CPU_ID = ?
            UNION
            SELECT Motherboard_ID FROM GM_SLOT_COMPATIBLE_WITH WHERE GPU_ID = ?
        )`;

    try {
        const [results] = await db.query(query, [productId, productId, productId, productId, productId, productId]);

        return isVIP ? results : results.filter(product => !product.VIP);
    } catch (error) {
        throw error;
    }
};

router.get("/:userId/:productInput", async (req, res) => {
    try {
        const userId = req.params.userId;
        const isVIP = await isVIPUser(userId);

        const parts = req.params.productInput.split(" ");
        if (parts.length < 2) {
            return res.status(400).json({ error: "Please enter a full product name (Category + Brand + Model)" });
        }

        const productCategory = parts[0]; 
        const productName = parts.slice(1).join(" ");

        const productId = await getProductId(productCategory, productName);
        if (!productId) {
            return res.status(404).json({ error: "Product not found" });
        }

        const compatibleProducts = await findCompatibleProducts(productId, isVIP);

        return res.json({ productId, isVIP, compatibleProducts });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

module.exports = router;