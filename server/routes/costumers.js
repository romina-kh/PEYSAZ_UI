const express = require("express");
const router = express.Router();
const db = require("../config/db");


const generate_rcode = async () => {
    let isUnique = false;
    let referralCode;

    while (!isUnique) {
        referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const [existing] = await db.query("SELECT 1 FROM COSTUMER WHERE Referral_code = ?", [referralCode]);


        if (existing.length === 0) {
            isUnique = true;
        }
    }
    return referralCode;
};

// ===========================================================================================

const createUser = async (userData) => {
    const { Phone_number, First_name, Last_name } = userData;

    try {
        
        const referralCode = await generate_rcode();

      
        const [result] = await db.query(
            "INSERT INTO COSTUMER (Phone_number, First_name, Last_name, Referral_code) VALUES (?, ?, ?, ?)",
            [Phone_number, First_name, Last_name, referralCode]
        );

        if (result.affectedRows === 0) {
            throw new Error("User creation failed");
        }

        const newUserID = result.insertId;
        const [newUser] = await db.query("SELECT * FROM COSTUMER WHERE ID = ?", [newUserID]);

        return newUser[0];
    } catch (err) {
        throw err;
    }
};

// ===========================================================================================

const getUsers = async () => {
    try {
        const [results] = await db.query("SELECT * FROM COSTUMER");
        return results;
    } catch (err) {
        throw err;
    }
};

// ===========================================================================================

router.get("/", async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===========================================================================================

router.post("/", async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.json({ message: "User created", costumer: newUser });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: err.message });
    }
});

// ===========================================================================================

router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { First_name, Last_name, Phone_number } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE COSTUMER SET First_name = ?, Last_name = ?, Phone_number = ? WHERE ID = ?",
            [First_name, Last_name, Phone_number, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Database error" });
    }
});

// ===========================================================================================

router.delete("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
    
        await db.query("DELETE FROM private_code WHERE DID = ?", [userId]);

        
        const [result] = await db.query("DELETE FROM COSTUMER WHERE ID = ?", [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// ===========================================================================================

router.get("/profile/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const [userResult] = await db.query(
            "SELECT ID, Phone_number, First_name, Last_name, Wallet_balance, Referral_code, CTimestamp FROM COSTUMER WHERE ID = ?",
            [userId]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userResult[0];
        const [vipResult] = await db.query(
            `SELECT Subscription_expiration_time,
                    TIMESTAMPDIFF(DAY, NOW(), Subscription_expiration_time) AS days_left,
                    TIMESTAMPDIFF(HOUR, NOW(), Subscription_expiration_time) % 24 AS hours_left,
                    TIMESTAMPDIFF(MINUTE, NOW(), Subscription_expiration_time) % 60 AS minutes_left
             FROM VIP_CLIENTS WHERE VID = ? AND Subscription_expiration_time > NOW()`,
            [userId]
        );

        if (vipResult.length > 0) {
            const vipData = vipResult[0];
            user.isVIP = true;
            user.VIP_Expires_In = `${vipData.days_left} days, ${vipData.hours_left} hours, ${vipData.minutes_left} minutes`;
        } else {
            user.isVIP = false;
            user.VIP_Expires_In = "Expired";
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;