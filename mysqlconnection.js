var mysql = require('mysql');
var syncMySql = require('sync-mysql');
var config = require('./mysql_config.json');

exports.pool = mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

exports.syncConnection = new syncMySql({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});