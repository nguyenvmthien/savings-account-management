require('dotenv').config();

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

let sql = `SELECT acc_id, account.cus_id, name, address, init_money, account.type, apply_date, open_date, close_date
FROM account 
JOIN customer ON account.cus_id = customer.cus_id
JOIN regulation ON account.type = regulation.type AND account.apply_date = regulation.applay_date`;

pool.query(sql, (err, rows, fields) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Rows:', rows);
    console.log('Fields:', fields);
});

// module.exports = pool.promise();
