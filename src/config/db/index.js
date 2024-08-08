require('dotenv').config();

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

let query = `SELECT * FROM test`;

pool.query(query, (err, rows) => {

    if (err) {
        console.log(err);
    }
    console.log(rows);
}
);

module.exports = pool.promise();