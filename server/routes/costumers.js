const express = require("express");
const router = express.Router();
const userService = require("../services/costumers");
const db = require("../config/db");


router.get("/", async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        res.json({ message: "User created", result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


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


router.delete("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const [result] = await db.query("DELETE FROM COSTUMER WHERE ID = ?", [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Database error" });
    }
});

module.exports = router;