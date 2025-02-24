const db = require("../config/db");


const getAllUsers = (callback) => {
  db.query("SELECT * FROM COSTUMER", (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};


const createUser = (userData, callback) => {
  const { ID, Phone_number, First_name, Last_name, Wallet_balance, Referral_code } = userData;
  db.query(
    "INSERT INTO COSTUMER (ID, Phone_number, First_name, Last_name, Wallet_balance, Referral_code) VALUES (?, ?, ?, ?, ?, ?)",
    [ID, Phone_number, First_name, Last_name, Wallet_balance, Referral_code],
    (err, results) => {
      if (err) 
        { console.error(err);
          return callback(err, null);}
      callback(null, results);
    }
  );
};



module.exports = { getAllUsers, createUser };