const mysql = require('mysql2');

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'shaman90',
    database: 'zerodue_final'
})

exports.db = db;