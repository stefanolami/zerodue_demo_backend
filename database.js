const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit : 100,
    host: 'localhost',
    user: 'root',
    password: 'shaman90',
    database: 'zerodue_final'
})

exports.db = db;