const express = require('express');
const router = express.Router();
const path = require('path');
const { mysqlCredentials } = require('../config/keys');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);

router.get('/', (req, res) => {

    const query = "SELECT * FROM urls WHERE googleID = ?";
    const insert = [req.user.googleID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results) => {
        if (err) console.log(err);
        console.log('URLS GET REQUEST FROM: ', user.req.googleID, ' data: ', results);
        res.send(results);
    });
});


module.exports = router;