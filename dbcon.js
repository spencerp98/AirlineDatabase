var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_spencerp',
    password        : '1278',
    database        : 'cs340_spencerp'
});

module.exports.pool = pool;