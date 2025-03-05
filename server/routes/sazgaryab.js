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

const getProductId = async (category, name) => {
    if (!category || !name) {
        return null; 
    }

    const query = 
        `SELECT ID FROM PRODUCT 
        WHERE Category = ? 
        AND CONCAT(Brand, ' ', Model) LIKE ? 
        LIMIT 1`;

    try {
        const [results] = await db.query(query, [category, `%${name}%`]);
        return results.length > 0 ? results[0].ID : null;
    } catch (error) {
        throw error;
    }
};

const findsazgarP = async (productId, isVIP) => {
    const query = 
        `SELECT P.ID, P.Brand, P.Model, P.Category
        FROM PRODUCT P
        WHERE P.ID IN (
            SELECT Power_ID FROM CONNECTOR_COMPATIBLE_WITH WHERE GPU_ID = ?
            UNION
            SELECT GPU_ID FROM CONNECTOR_COMPATIBLE_WITH WHERE Power_ID = ?
            UNION
            SELECT Motherboard_ID FROM SM_SLOT_COMPATIBLE_WITH WHERE SSD_ID = ?
            UNION
            SELECT SSD_ID FROM SM_SLOT_COMPATIBLE_WITH WHERE Motherboard_ID = ?
            UNION
            SELECT Motherboard_ID FROM RM_SLOT_COMPATIBLE_WITH WHERE RAM_ID = ?
            UNION
            SELECT RAM_ID FROM RM_SLOT_COMPATIBLE_WITH WHERE Motherboard_ID = ?
            UNION
            SELECT Cooler_ID FROM CC_SOCKET_COMPATIBLE_WITH WHERE CPU_ID = ?
            UNION
            SELECT CPU_ID FROM CC_SOCKET_COMPATIBLE_WITH WHERE Cooler_ID = ?
            UNION
            SELECT Motherboard_ID FROM MC_SOCKET_COMPATIBLE_WITH WHERE CPU_ID = ?
            UNION
            SELECT CPU_ID FROM MC_SOCKET_COMPATIBLE_WITH WHERE Motherboard_ID = ?
            UNION
            SELECT Motherboard_ID FROM GM_SLOT_COMPATIBLE_WITH WHERE GPU_ID = ?
            UNION
            SELECT GPU_ID FROM GM_SLOT_COMPATIBLE_WITH WHERE Motherboard_ID = ?
        )`;

    try {
        const [results] = await db.query(query, [productId, productId, productId, productId, productId, productId, productId, productId, productId, productId, productId, productId]);
        return isVIP ? results : results.filter(product => !product.VIP);
    } catch (error) {
        throw error;
    }
};

router.get("/:userId/:product", async (req, res) => {
    try {
        const userId = req.params.userId;
        const isVIP = await isVIPUser(userId);

        const product = req.params.product.split(",").map(p => p.trim()); 

        if (product.length === 0) {
            return res.status(400).json({ error: "Please enter at least one product." });
        }

        let allsazgarP = [];
        let productSazgar = {};
        
        for (const input of product) {
            const parts = input.split(" ");
            if (parts.length < 2) {
                return res.status(400).json({ error: `Invalid product format: ${input}`});
            }

            const category = parts[0]; 
            const name = parts.slice(1).join(" ");

            const productId = await getProductId(category, name);
            if (!productId) {
                return res.status(404).json({ error: `Product not found: ${input}` });
            }

            const sazgarP = await findsazgarP(productId, isVIP);
            productSazgar[input] = sazgarP;
            allsazgarP.push(sazgarP.map(p => p.ID));
        }

        
        const commonIds = allsazgarP.length > 0
        ? allsazgarP.reduce((acc, list) => acc.filter(id => list.includes(id)))
        : [];
        
        let common = [];
        if (commonIds.length > 0) {
            const query = 
                `SELECT ID, Brand, Model, Category 
                FROM PRODUCT 
                WHERE ID IN (?)`;
            
            try {
                const [results] = await db.query(query, [commonIds]);
                common = results; 
            } catch (error) {
                console.error("Error fetching common compatible products:", error);
            }
        }
        
        res.json({ productSazgar, common });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});


router.get("/all-products", async (req, res) => {
    try {
        const query = "SELECT ID, Brand, Model, Category FROM PRODUCT";
        const [products] = await db.query(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products", details: error.message });
    }
});



module.exports = router;
