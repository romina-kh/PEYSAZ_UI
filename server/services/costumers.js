const db = require("../config/db");


const getAllUsers = (callback) => {
  db.query("SELECT * FROM COSTUMER", (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};


// const getUserById = (id, callback) => {
//   db.query("SELECT * FROM users WHERE ID = ?", [id], (err, results) => {
//     if (err) return callback(err, null);
//     callback(null, results[0]); // Return single user
//   });
// };


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


// const updateUser = (id, userData, callback) => {
//   const { Phone_number, First_name, Last_name, Wallet_balance, Referral_code } = userData;
//   db.query(
//     "UPDATE users SET Phone_number = ?, First_name = ?, Last_name = ?, Wallet_balance = ?, Referral_code = ? WHERE ID = ?",
//     [Phone_number, First_name, Last_name, Wallet_balance, Referral_code, id],
//     (err, results) => {
//       if (err) return callback(err, null);
//       callback(null, results);
//     }
//   );
// };


// const deleteUser = (id, callback) => {
//   db.query("DELETE FROM users WHERE ID = ?", [id], (err, results) => {
//     if (err) return callback(err, null);
//     callback(null, results);
//   });
// };

module.exports = { getAllUsers, createUser };