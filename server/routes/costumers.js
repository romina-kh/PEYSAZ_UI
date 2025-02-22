const express = require("express"); 
const router = express.Router(); 
const userService = require("../services/costumers"); 


router.get("/", (req, res) => {
    userService.getAllUsers((err, users) => { 
        if (err) return res.status(500).json({ error: err.message }); 
        res.json(users); }); }); 
     
// router.get("/:id", (req, res) => { 
//     const userId = req.params.id; 
//     userService.getUserById(userId, (err, user) => { 
//         if (err) return res.status(500).json({ error: err.message }); 
//         if (!user) return res.status(404).json({ message: "User not found" }); 
//         res.json(user); }); }); 
        
router.post("/", (req, res) => { 
    userService.createUser(req.body, (err, result) => { 
        if (err) return res.status(500).json({ error: err.message }); 
        res.json({ message: "User created", result }); 
    }); 
});

module.exports = router;