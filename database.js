const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit : 100,
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'b04ddce483bfc3',
    password: 'b41252bd',
    database: 'heroku_a600ef4280fca9f'
})

exports.db = db;