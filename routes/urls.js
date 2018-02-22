const express = require('express');
const router = express.Router();
const path = require('path');
const mysqlCredentials = require('../mysqlCredentials');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);

router.get('/', (req, res) => {

    const query = "SELECT * FROM urls WHERE googleID = ?";
    const insert = [req.user];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results) => {
        if (err) console.log(err);
        console.log('URLS GET REQUEST FROM: ', user.req, ' data: ', results);
        res.send(results);
    });
});


module.exports = router;