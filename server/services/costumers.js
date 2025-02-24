const db = require("../config/db");

const getAllUsers = async () => {
    try {
        const [results] = await db.query("SELECT * FROM COSTUMER");
        return results;
    } catch (err) {
        throw err;
    }
};

const createUser = async (userData) => {
    const { Phone_number, First_name, Last_name, Referral_code } = userData;
    
    try {
        const [result] = await db.query(
            "INSERT INTO COSTUMER (Phone_number, First_name, Last_name, Referral_code) VALUES (?, ?, ?, ?)",
            [Phone_number, First_name, Last_name, Referral_code || null]
        );
  
        if (result.affectedRows === 0) {
            throw new Error("User creation failed");
        }
  
        // Retrieve the newly created user using LAST_INSERT_ID()
        const [newUser] = await db.query("SELECT * FROM COSTUMER WHERE ID = LAST_INSERT_ID()");
        
        return newUser[0]; 
    } catch (err) {
        throw err;
    }
  };

module.exports = { getAllUsers, createUser };