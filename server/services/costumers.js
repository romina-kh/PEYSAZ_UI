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
  const { ID, Phone_number, First_name, Last_name, Wallet_balance, Referral_code } = userData;
  try {
      const [result] = await db.query(
          "INSERT INTO COSTUMER (ID, Phone_number, First_name, Last_name,Wallet_balance, Referral_code) VALUES (?, ?, ?, ?, ?, ?)",
          [ID, Phone_number, First_name,Last_name, Wallet_balance, Referral_code]
      );

      if (result.affectedRows === 0) {
          throw new Error("User creation failed");
      }

      
      const [newUser] = await db.query("SELECT * FROM COSTUMER WHERE ID = ?", [ID]);
      
      return newUser[0]; 
  } catch (err) {
      throw err;
  }
};

module.exports = { getAllUsers, createUser };