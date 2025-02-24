const express = require("express"); 
const router = express.Router(); 
const userService = require("../services/costumers"); 
const db = require("../config/db")


router.get("/", (req, res) => {
    userService.getAllUsers((err, users) => { 
        if (err) return res.status(500).json({ error: err.message }); 
        res.json(users); }); }); 
     
        
router.post("/", (req, res) => { 
    userService.createUser(req.body, (err, result) => { 
        if (err) return res.status(500).json({ error: err.message }); 
        res.json({ message: "User created", result }); 
    }); 
});


router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { First_name, Last_name, Phone_number } = req.body;
  
    const query =
      "UPDATE COSTUMER SET First_name = ?, Last_name = ?, Phone_number = ? WHERE ID = ?";
  
    db.query(query, [First_name, Last_name, Phone_number, userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Profile updated successfully" });
    });
  });

  router.delete("/:id", async (req, res) => {
    const userId = req.params.id;
  
    const query = "DELETE FROM COSTUMER WHERE ID = ?";
   
    db.query(query, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Account deleted successfully" });
    });
  });
  
  


module.exports = router;